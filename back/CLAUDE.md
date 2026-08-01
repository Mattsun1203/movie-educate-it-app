# CLAUDE.md

このファイルは`back/`配下で作業する際のガイド。全体のルールはリポジトリルートの`CLAUDE.md`を参照すること。

`back/`はHono + Prisma 7で構築するCodeStepのバックエンド（APIサーバー）で、**Cloudflare Workers**（+ Hyperdriveによるコネクションプーリング、DB本体はNeon）にデプロイする前提で構成している。ネイティブESM（`"type": "module"`）で構成しており、相対importは常に`.js`拡張子を付ける（NodeNextのESM解決規約。`.ts`ファイルでも実行時に解決されるファイルは`.js`なので、例えば`./logger/logger.js`のように書く）。

## コマンド

コマンドはすべて`back/`ディレクトリから実行する（Biomeのフォーマット/リントコマンドはリポジトリルートから実行するため、ルートの`CLAUDE.md`を参照）。

```bash
pnpm dev              # wrangler dev（ローカルでWorkersランタイムを再現して起動。DBはdocker-compose）
pnpm deploy           # wrangler deploy（Cloudflareへデプロイ）
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run（@cloudflare/vitest-pool-workers、workerd上で実行。DB不要）
pnpm db:generate       # prisma generate（schema.prisma変更後にクライアント再生成）
pnpm db:migrate        # prisma migrate dev（新規マイグレーションの作成・適用。ローカルDockerのPostgreSQLに対して実行）
pnpm db:migrate:deploy # prisma migrate deploy（既存マイグレーションの適用のみ、対話なし。Neonのdevelop/mainなど共有環境向け）
pnpm db:studio         # prisma studio
```

単一のテストファイルのみ実行する場合: `pnpm test src/app.test.ts`

## 初回セットアップ（一度だけ必要な手動作業）

このリポジトリのコードだけでは完結しない、Cloudflare/Neonアカウントに紐づく手動作業。

1. `wrangler login`（ブラウザ認証）
2. `wrangler hyperdrive create <name> --connection-string="<Neon mainブランチの接続文字列>"`を実行し、出力された`id`を`wrangler.jsonc`の`hyperdrive[0].id`（本番用）に設定する
3. `wrangler hyperdrive create <name> --connection-string="<Neon developブランチの接続文字列>"`を実行し、出力された`id`を`wrangler.jsonc`の`env.develop.hyperdrive[0].id`（ステージング用）に設定する
4. `docker compose up -d`でローカルPostgreSQLを起動し、`.env.example`を`.env`にコピーする（`DATABASE_URL`はローカルDockerを指す設定済みの値のまま）
5. `.dev.vars.example`を`.dev.vars`にコピーする（ローカルDockerのPostgreSQLを指す設定済みの値のまま。`wrangler dev`はこれでローカルでもHyperdrive経由の接続をシミュレートする）
6. Neonに`develop`・`main`の2ブランチを用意し、それぞれに`prisma migrate deploy`でスキーマを適用しておく（CIはこの`develop`ブランチから使い捨てブランチを複製してテストを実行する。ステージングWorker（`env.develop`）も同じ`develop`ブランチのHyperdrive経由でこのスキーマに接続する）
7. GitHubリポジトリのSecrets/Variablesに`NEON_API_KEY`（Secret）・`NEON_PROJECT_ID`（Variable）を登録する（`.github/workflows/back-test.yml`のテストジョブが使用）
8. GitHubリポジトリのSecretsに`CLOUDFLARE_API_TOKEN`・`CLOUDFLARE_ACCOUNT_ID`を登録する（`.github/workflows/back-test.yml`のdeployジョブが使用。Workers編集権限を持つAPIトークンを発行すること）

## アーキテクチャ

### Honoアプリの構成とAPIのベースパス

`src/app.ts`が全体の要であり、**そのままCloudflare Workersのエントリポイント**でもある（`wrangler.jsonc`の`main`が`src/app.ts`を指す）。`new Hono().basePath("/api")`で全ルートを`/api`配下に統一している。Workersには「起動」という概念がなく、リクエストごとにfetchハンドラが呼ばれるだけなので、Node.js時代にあった`src/index.ts`（`serve()`呼び出し・起動時ログ・起動時`$connect()`）は廃止した。

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

### Bindings（Hyperdrive）

`src/app.ts`で`Bindings`型（`{ HYPERDRIVE: Hyperdrive }`）を定義し、`new Hono<{ Bindings: Bindings; Variables: LoggerVariables }>()`としている。ハンドラ内では`context.env.HYPERDRIVE.connectionString`でHyperdrive経由のPostgreSQL接続文字列を取得できる（本番はNeonへプールされた接続、ローカルは`.dev.vars`の`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`で指定した接続先）。`Hyperdrive`型は`@cloudflare/workers-types`のグローバル型（tsconfigの`types`に追加済み）。

### Prismaクライアントはリクエストごとに生成する

- スキーマは`prisma/schema.prisma`。ドメインモデルは`User` / `Course` / `Lesson` / `LessonProgress`の4つで、`front/`の`CourseCard`・`LessonListItem`コンポーネントが要求する型に対応させている。
- Prisma 7の新クライアント生成（`generator client { provider = "prisma-client" }`）を使用しており、出力先は`src/generated/prisma`。**あえてsrc配下に生成している**点に注意: 出力先を`src`の外にすると、`tsc`のrootDir推論が`src/`と`generated/`の共通の親をrootDirとみなしてしまい、ビルド出力がネストして壊れる。生成物自体はgit管理対象外（`.gitignore`参照）。Prisma 7既定のESM出力をそのまま使っている（`moduleFormat`は指定しない）。
- `src/prisma/client.ts`は**シングルトンをexportしていない**。`createPrismaClient(connectionString: string)`というファクトリ関数をexportしており、**各ルートハンドラでリクエストごとに呼び出す**想定（`createPrismaClient(context.env.HYPERDRIVE.connectionString)`）。これはCloudflare公式ドキュメントが明記している必須パターンで、Hyperdrive経由でPrismaClientをグローバルな単一インスタンスとして使い回すと2回目以降のリクエストでハングするバグが報告されているため。Node.jsサーバー時代の`PrismaService`のような起動時`$connect()`は行わない（Workersに「起動」の概念がないため）。
- 環境ごとのDB接続先は次の通り: ローカル開発 = docker-compose起動のPostgreSQL、CIテスト = Neonの使い捨てブランチ（`develop`から複製）、本番 = Neonの`main`ブランチ。いずれも**アプリのコードは変更不要**で、Hyperdriveのローカル接続文字列（`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`）または本番のバインディングIDだけが変わる。

**Neonの`develop`/`main`にマイグレーションを反映する手順**（`db:migrate`＝`migrate dev`ではなく`db:migrate:deploy`＝`migrate deploy`を使うこと。既存のマイグレーションファイルをそのまま当てるだけで、対話も新規ファイル生成もしない）:

1. `prisma/schema.prisma`を編集し、ローカルで`pnpm db:migrate`（`.env`のDATABASE_URL＝ローカルDocker）を実行してマイグレーションファイルを生成・確認する
2. 生成された`prisma/migrations/`配下のファイルをコミットする
3. `DATABASE_URL="<Neon developブランチの接続文字列>" pnpm db:migrate:deploy`で`develop`に適用する
4. 動作確認後、`DATABASE_URL="<Neon mainブランチの接続文字列>" pnpm db:migrate:deploy`で`main`（本番）に適用する

shellで直接`DATABASE_URL`を指定すればdotenvは`.env`の値で上書きしない（すでに設定済みの環境変数は尊重される）ため、`.env`自体を書き換える必要はない。

### ロギング（pino browserモード）

pinoを使用しているが、**`transport`オプション（`pino-pretty`など）は使わない**。`pino-pretty`を含むpinoのtransport機能はNode.jsの`worker_threads`に依存しており、Cloudflare Workersのランタイム（workerd）では動作しないため、`src/logger/logger.ts`では`browser`モード（`console.log`への書き込みに差し替える設定）を使っている。

```ts
pino({
  browser: { asObject: true, write: (o) => console.log(JSON.stringify(o)) },
  level: ...,
});
```

ローカルで整形して見たい場合は`pino-pretty`をCLIとしてパイプする（`pnpm dev | pino-pretty`）。pino自体にはtransportとして組み込まない。

その他のロギング設計（`src/logger/middleware.ts`・`src/common/error-handler.ts`）:

- **HTTPアクセスログは`loggerMiddleware`が自動記録する。** リクエストごとに`reqId`付きの子ロガーを生成して`context.set("logger", ...)`し、`await next()`のあとにメソッド・パス・ステータス・応答時間を1行でログする。ハンドラ側で同内容を重ねて出さないこと。
- **ログレベル**: `fatal`/`error`/`warn`/`info`/`debug`の5段階。`LOG_LEVEL`環境変数で明示指定できるが、未設定時は`NODE_ENV`に応じて自動で決まる: `development`（未設定時のデフォルト）→`debug`、`production`→`info`、`test`→`silent`。
  - `DEBUG`: バグ調査用。変数の中身、分岐、SQL詳細など
  - `INFO`: システムが正しく動いていることの確認。アクセスログなど
  - `WARN`: まだエラーではないが注意が必要な状態。**業務エラー（バリデーション失敗など、4xxで返すもの）もここで十分**
  - `ERROR`: すぐに対応が必要な問題（5xx）
  - `FATAL`: システム継続不能な致命的エラー
- **エラーは1件1ログに一本化**: `app.onError(errorHandler)`に集約している。`err`（スタックトレース込み）・`statusCode`・`errorType`（例外クラス名）を構造化フィールドで付与し、5xxは`error`、4xx（`HTTPException`）は`warn`とする。メタ情報はメッセージ文字列に埋め込まず必ずオブジェクトのフィールドとして渡すこと。ただし**Honoの`onError`はルートが一致しない404では呼ばれない**（`loggerMiddleware`のアクセスログ側で自動的にWARNとして記録されるため実害はない）。
- **レイヤーごとのcontext**: デコレータDIが無いため、ハンドラ/サービス関数側で`context.get("logger").child({ context: "ModuleName" })`のように明示する規約にする。
- **userIdの伝播**: 認証実装時、認証ミドルウェアが`context.set("logger", context.get("logger").child({ userId }))`とすることで、以降そのリクエスト内の全ログ（アクセスログ含む）に`userId`が自動的に乗る。
- **ログローテーションは実装していない。** Cloudflare Workersは標準出力（`console.log`）に出すだけで、収集・保持はCloudflare側のログ基盤（Workers LogsやTail Workers、外部ログサービスへの転送設定）に委ねる想定。

### テスト（@cloudflare/vitest-pool-workers）— 3層構成

`vitest.config.ts`は`cloudflareTest`（`@cloudflare/vitest-pool-workers`のVite plugin）を使い、`wrangler.jsonc`の設定をそのまま読み込む（`wrangler: { configPath: "./wrangler.jsonc" }`）。テストは実際のWorkersランタイム（workerd）上で実行される。`src/app.test.ts`では`cloudflare:test`モジュールの`SELF.fetch(...)`でアプリにリクエストを送る（`app.request()`ではない点に注意。プレーンなHonoの`app.request()`はNode.js実行時の簡易ヘルパーで、workerd上でのバインディング解決を正しく再現しない）。

Hyperdriveバインディングのローカル接続先は`wrangler dev`と全く同じ仕組み（`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`環境変数、未設定時は`wrangler.jsonc`の`localConnectionString`）で解決される。この仕組みを使って、目的に応じて3つの層でテストを実行する。

1. **ローカルでの`pnpm test`（既定、DB不要のモックテスト）**: 環境変数を何も設定しなくても動く。`wrangler.jsonc`の`hyperdrive[0].localConnectionString`にダミーのプレースホルダー接続文字列（`postgresql://placeholder:placeholder@localhost:5432/placeholder`）を設定してあるため、Hyperdriveバインディング自体は解決できる状態で起動する。**実際にこのプレースホルダーへ接続を試みるわけではなく、テストがDBに触れるルートを実行しない限り問題は起きない。** DBに触れるルートを追加した場合、ローカルテストではPrismaクライアント呼び出しを`vi.mock()`等でモックし、実DBに接続しない形でテストを書くこと（現状DBを使うルートが無いため実例は無い）。
2. **CI（GitHub Actions、`.github/workflows/back-test.yml`）**: `push`/`pull_request`をトリガーに、Neonの`develop`ブランチから使い捨てブランチ（`neondatabase/create-branch-action`）を複製し、その接続文字列を`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE`として渡してテストを実行する。実DBに対する結合テストの位置づけ。終了後は成功・失敗に関わらず`neondatabase/delete-branch-action`でブランチを削除する。GitHubのSecrets/Variablesに`NEON_API_KEY`・`NEON_PROJECT_ID`が必要。
3. **手動で実DBに対してテストしたい場合**: `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="<接続文字列>" pnpm test`のように環境変数を明示的に渡せば、ローカルDocker PostgreSQLやNeonの任意のブランチに対してテストできる（環境変数は`wrangler.jsonc`のプレースホルダーより優先される）。

Testcontainersは使っていない（DB本体がNeonであり、CIでの実DBテストはNeonのブランチ機能で完結するため）。

## 過去の移行の経緯

- **NestJS → Hono**: デコレータベースDIをやめたことで、Biomeの`useImportType`ルールとの衝突やパラメータデコレータのパースエラーが解消された。
- **Node.js（`@hono/node-server`） → Cloudflare Workers**: デプロイ先をCloudflare Workers一本に決めたことに伴い、Node.js向けエントリポイント（`tsx`、`@hono/node-server`、`pnpm start`）を廃止。あわせてPrismaクライアントをリクエストごとの生成に変更し、pinoをbrowserモードに変更した。
- **Jest → Vitest → @cloudflare/vitest-pool-workers**: Prisma 7のWASM動的import対応のためJestから一度Vitestに切り替え、その後Workersランタイムでの挙動を正確に検証するため`@cloudflare/vitest-pool-workers`を導入した。
