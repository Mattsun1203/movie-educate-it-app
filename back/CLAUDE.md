# CLAUDE.md

このファイルは`back/`配下で作業する際のガイド。全体のルールはリポジトリルートの`CLAUDE.md`を参照すること。

`back/`はHono + Prisma 7 + PostgreSQLで構築するCodeStepのバックエンド（APIサーバー）。ネイティブESM（`"type": "module"`）で構成しており、相対importは常に`.js`拡張子を付ける（NodeNextのESM解決規約。`.ts`ファイルでも実行時に解決されるファイルは`.js`なので、例えば`./logger/logger.js`のように書く）。

## コマンド

コマンドはすべて`back/`ディレクトリから実行する（Biomeのフォーマット/リントコマンドはリポジトリルートから実行するため、ルートの`CLAUDE.md`を参照）。

```bash
pnpm dev              # tsx watch src/index.ts（ファイル変更を検知して自動再起動）
pnpm build            # tsc -p tsconfig.build.json
pnpm start            # node dist/index.js（要ビルド済み）
pnpm test             # vitest run --config vitest.config.ts（DB不要な高速テスト、src/**/*.test.ts）
pnpm test:e2e         # vitest run --config vitest.e2e.config.ts（Testcontainers経由、後述）
pnpm db:generate      # prisma generate（schema.prisma変更後にクライアント再生成）
pnpm db:migrate       # prisma migrate dev（マイグレーション作成・適用）
pnpm db:studio        # prisma studio
```

単一のテストファイルのみ実行する場合: `pnpm test src/app.test.ts`

## アーキテクチャ

### Honoアプリの構成とAPIのベースパス

`src/app.ts`が全体の要。`new Hono().basePath("/api")`で全ルートを`/api`配下に統一している（NestJS時代の`setGlobalPrefix("api")`相当）。エントリポイントは`src/index.ts`で、`@hono/node-server`の`serve()`でNode.js上に立ち上げるだけの薄い層にしてある（`app.ts`自体はテストから直接importして`app.request()`で叩けるようにするため、`serve()`の呼び出しから分離している）。

**命名は省略しない。** Honoの公式ドキュメント/コミュニティでは`Context`型の引数を慣例的に`c`と略記するが、このリポジトリでは使わず`context`と書く。

### Hono RPCとAppTypeのexport

`app.ts`では全ルートを**1つの式でチェーンし続け**、その式の型を`AppType`としてexportしている。

```ts
const routes = app.get("/", (context) => context.text("Hello World!"));
export type AppType = typeof routes;
```

**ルートを追加する際は必ずこのチェーンに繋げること。** 式を分割して`app.get(...)`を別文として書くと、Hono RPCの型推論（チェーンされた戻り値の型に蓄積される）が壊れ、`AppType`に新しいルートの型が反映されない。

`back/package.json`の`"types": "./src/app.ts"`により、他パッケージから`import type { AppType } from "back"`で型だけをimportできる（実行時コードはbundleされない、型消去のみ）。`front/`はこれを使い、`front/package.json`に`"back": "workspace:*"`をdevDependenciesとして追加した上で、`hc<AppType>(baseUrl)`（`front/src/lib/api/client.ts`）から型安全なRPCクライアントを生成している。

呼び出し規約に注意: `basePath("/api")`配下のルートパス`"/"`は、クライアント側では`apiClient.api.$get()`のように**basePathのセグメント名（`api`）がプロパティ名になる**（`.index`ではない）。新しいルートを追加した際は、`front/`側の呼び出し形が実際に一致するか`pnpm exec tsc --noEmit`で必ず確認すること（プロパティ名はルートパスの構造から機械的に決まるため、思い込みで書かずに型エラーで検証する）。

### ロギング

pino/pino-prettyを直接使用する（`nestjs-pino`のようなフレームワーク統合ライブラリはNestJS廃止にともない使っていない）。設定は`src/logger/logger.ts`（pinoインスタンス生成）と`src/logger/middleware.ts`（リクエストごとの子ロガー生成・アクセスログ出力）に分かれている。

- **HTTPアクセスログは`loggerMiddleware`が自動記録する。** リクエストごとに`reqId`付きの子ロガーを生成して`context.set("logger", ...)`し、`await next()`のあとにメソッド・パス・ステータス・応答時間を1行でログする（`pino-http`のautoLogging相当を自前実装）。ハンドラ側で同内容を重ねて出さないこと。
- **ログレベル**: `fatal`/`error`/`warn`/`info`/`debug`の5段階。`LOG_LEVEL`環境変数（`.env`参照。空文字列も未設定として扱う点に注意、`||`で判定している）で明示指定できるが、未設定時は`NODE_ENV`に応じて自動で決まる: `development`（未設定時のデフォルト）→`debug`、`production`→`info`、`test`→`silent`。
  - `DEBUG`: バグ調査用。変数の中身、分岐、SQL詳細など
  - `INFO`: システムが正しく動いていることの確認。起動/シャットダウン、アクセスログなど
  - `WARN`: まだエラーではないが注意が必要な状態。**業務エラー（バリデーション失敗など、4xxで返すもの）もここで十分**
  - `ERROR`: すぐに対応が必要な問題（5xx）
  - `FATAL`: システム継続不能な致命的エラー
- **エラーは1件1ログに一本化**: `app.onError(errorHandler)`（`src/common/error-handler.ts`）に集約している。`err`（スタックトレース込み）・`statusCode`・`errorType`（例外クラス名）を構造化フィールドで付与し、5xxは`error`、4xx（`HTTPException`）は`warn`とする。メタ情報はメッセージ文字列に埋め込まず必ずオブジェクトのフィールドとして渡すこと。ただし**Honoの`onError`はルートが一致しない404では呼ばれない**（`loggerMiddleware`のアクセスログ側で自動的にWARNとして記録されるため実害はない）。
- **レイヤーごとのcontext**: NestJSのようなデコレータDIが無いため、ハンドラ/サービス関数側で`context.get("logger").child({ context: "ModuleName" })`のように明示する規約にする。
- **userIdの伝播**: 認証実装時、認証ミドルウェアが`context.set("logger", context.get("logger").child({ userId }))`とすることで、以降そのリクエスト内の全ログ（アクセスログ含む）に`userId`が自動的に乗る（Honoの`Context`はリクエストごとに明示的に引き回されるため、NestJSで使っていたAsyncLocalStorageは不要）。
- **フォーマット**: `NODE_ENV === "development"`のときだけ`pino-pretty`で整形。それ以外（`test`/`production`）はプレーンなJSON。
- **ログローテーションは実装していない。** アプリ自体はまだコンテナ化・デプロイしておらず標準出力オンリー設計のため。将来的にはDockerのlog-optsやホスティング先のログ管理機能に委ねる。

### Prisma

- スキーマは`prisma/schema.prisma`。ドメインモデルは`User` / `Course` / `Lesson` / `LessonProgress`の4つで、`front/`の`CourseCard`・`LessonListItem`コンポーネントが要求する型に対応させている。
- Prisma 7の新クライアント生成（`generator client { provider = "prisma-client" }`）を使用しており、出力先は`src/generated/prisma`。**あえてsrc配下に生成している**点に注意: 出力先を`src`の外にすると、`tsc`のrootDir推論が`src/`と`generated/`の共通の親をrootDirとみなしてしまい、ビルド出力が`dist/index.js`ではなく`dist/src/index.js`のようにネストして壊れる（NestJS固有ではなく`tsc`一般の挙動）。`tsconfig.build.json`の`include: ["src/**/*"]`もこの問題を避けるための設定。生成物自体はgit管理対象外（`.gitignore`参照）。Prisma 7既定のESM出力をそのまま使っている（`moduleFormat`は指定しない）。
- クライアントは`src/prisma/client.ts`でシングルトンとしてexportしている（`export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`）。ドライバアダプタ方式（`@prisma/adapter-pg` + `pg`）を使用。
- `src/index.ts`で起動時に`await prisma.$connect()`し、成功をログしている。

### ローカルDB

`docker-compose.yml`でローカル開発用PostgreSQLコンテナを起動できる（`docker compose up -d`）。ポートは**5432ではなく5434**を使用している（別プロジェクトのPostgreSQLコンテナとのポート競合を避けるため）。接続情報は`.env`の`DATABASE_URL`（`.env.example`参照、`.env`自体はgit管理対象外）。

### テスト（Vitest）

- `vitest.config.ts` — `src/**/*.test.ts`が対象。DBを使わない高速テスト用（`src/app.test.ts`が実例。`app.request("/api")`でHonoアプリを直接叩ける。ポート待受も不要）。
- `vitest.e2e.config.ts` — `test/**/*.test.ts`が対象。`globalSetup`に`test/testcontainers-setup.ts`を指定している。
- `test/testcontainers-setup.ts`は、デフォルトエクスポート関数内でPostgreSQLコンテナ（Testcontainers）を起動し、`process.env.DATABASE_URL`をセットしてから`prisma migrate deploy`でマイグレーションを適用する。**関数がteardown用の関数をそのままreturnできる**ため（Vitestの`globalSetup`の仕様）、Jest版で必要だったsetup/teardown間の状態共有ファイルは不要になった。
- Prisma 7の新クライアントはWASMクエリコンパイラを動的importで読み込むが、**Vitestはこれをネイティブに扱えるため特別なフラグは不要**（NestJS + Jestの構成では`--experimental-vm-modules`や`.js`拡張子解決用の`moduleNameMapper`が必須だったが、Vitestへの移行でどちらも不要になった）。

## Nest→Hono移行の経緯

以前は NestJS 11 + `nestjs-pino` + デコレータベースDIで構築していたが、Honoベースに全面移行した。この移行にともない、NestJS固有だった以下の問題は解消済み（対応するBiome設定・依存も削除済み）:

- Biomeの`useImportType`ルールとNestJSのDIメタデータ生成（`emitDecoratorMetadata`）の衝突 → デコレータDIが無いため発生しない
- Biomeがパラメータデコレータをパースできない問題 → パラメータデコレータ自体を使っていないため発生しない
- Jest + Prisma 7のWASM動的importの相性問題 → Vitestへの移行で解消
