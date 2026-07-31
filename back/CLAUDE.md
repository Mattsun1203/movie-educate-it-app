# CLAUDE.md

このファイルは`back/`配下で作業する際のガイド。全体のルールはリポジトリルートの`CLAUDE.md`を参照すること。

`back/`はNestJS 11 + Prisma 7 + PostgreSQLで構築するCodeStepのバックエンド（APIサーバー）。

## コマンド

コマンドはすべて`back/`ディレクトリから実行する（Biomeのフォーマット/リントコマンドはリポジトリルートから実行するため、ルートの`CLAUDE.md`を参照）。

```bash
pnpm start            # nest start
pnpm start:dev        # nest start --watch
pnpm build            # nest build
pnpm test             # jest（ユニットテスト、src/**/*.spec.ts）
pnpm test:e2e         # jest --config ./test/jest-e2e.json（E2Eテスト、後述）
pnpm db:generate      # prisma generate（schema.prisma変更後にクライアント再生成）
pnpm db:migrate       # prisma migrate dev（マイグレーション作成・適用）
pnpm db:studio        # prisma studio
```

単一のユニットテストファイルのみ実行する場合: `pnpm test app.controller.spec.ts`

## アーキテクチャ

### APIのグローバルプレフィックス

`src/main.ts`で`app.setGlobalPrefix("api")`を設定しており、全ルートは`/api`配下に統一されている。エンドポイントを叩く際・追加する際は必ず`/api`が前提であることを意識すること。

### Prisma

- スキーマは`prisma/schema.prisma`。ドメインモデルは`User` / `Course` / `Lesson` / `LessonProgress`の4つで、`front/`の`CourseCard`・`LessonListItem`コンポーネントが要求する型（受講レベル、進捗ステータスなど）に対応させている。
- Prisma 7の新クライアント生成（`generator client { provider = "prisma-client" }`）を使用しており、出力先は`src/generated/prisma`。**あえてsrc配下に生成している**点に注意: 出力先を`src`の外（例: `../generated/prisma`）にすると、`tsc`のrootDir推論が`src/`と`generated/`の共通の親をrootDirとみなしてしまい、`nest build`の出力が`dist/main.js`ではなく`dist/src/main.js`のようにネストして壊れる。`tsconfig.build.json`の`include: ["src/**/*"]`もこの問題を避けるための設定。生成物自体はgit管理対象外（`.gitignore`参照）。
- クライアントはドライバアダプタ方式（`@prisma/adapter-pg` + `pg`）を使用する。`PrismaService`（`src/prisma/prisma.service.ts`）が`PrismaClient`を継承し、コンストラクタで`new PrismaPg({ connectionString: process.env.DATABASE_URL })`を渡している。`PrismaModule`は`@Global()`なので、他のモジュールで個別にimportする必要はない。

### ローカルDB

`docker-compose.yml`でローカル開発用PostgreSQLコンテナを起動できる（`docker compose up -d`）。ポートは**5432ではなく5434**を使用している（別プロジェクトのPostgreSQLコンテナとのポート競合を避けるため）。接続情報は`.env`の`DATABASE_URL`（`.env.example`参照、`.env`自体はgit管理対象外）。

### E2Eテスト（Testcontainers）

`test:e2e`は手動でのDB起動を必要としない。`test/testcontainers/global-setup.ts`がJestの`globalSetup`フックとしてPostgreSQLコンテナ（Testcontainers）を自動起動し、`prisma migrate deploy`でマイグレーションを適用してから`process.env.DATABASE_URL`をテスト用DBに向ける。`test/testcontainers/global-teardown.ts`がテスト終了後にコンテナを破棄する。コンテナの実体を保持する`containerState`（`test/testcontainers/postgres-container.ts`）をsetup/teardown間で共有している。

Prisma 7の新クライアントはWASMクエリコンパイラを動的importで読み込むため、`test:e2e`は`node --experimental-vm-modules node_modules/jest/bin/jest.js --config ./test/jest-e2e.json`という形で実行している（通常の`jest`コマンドのままだと`A dynamic import callback was invoked without --experimental-vm-modules`で失敗する）。同じ理由で、`test/jest-e2e.json`と`package.json`のjest設定（ユニットテスト用）の両方に、生成コードの`.js`拡張子importをJestが解決できるようにする`moduleNameMapper`（`^(\\.{1,2}/.*)\\.js$`）を追加している。

### ロギング

`nestjs-pino`（pinoベース）を使用しており、独自の`LoggerService`実装や自前のHTTPロギング用インターセプターは書いていない。設定は`src/logger/logger.config.ts`に集約している。

- `main.ts`で`NestFactory.create(AppModule, { bufferLogs: true })` + `app.useLogger(app.get(Logger))`（`nestjs-pino`の`Logger`）を行っており、Nest自身の起動ログも含めて全てpino経由で統一フォーマットになる。
- **HTTPアクセスログは自動記録される。** `pino-http`のautoLoggingにより、リクエストごとに1行（メソッド・パス・ステータス・応答時間・`reqId`）がレスポンス確定時に出力される。独自のインターセプターは不要。
- **ログレベル**: `fatal`/`error`/`warn`/`info`/`debug`の5段階（`trace`は使わない方針）。`LOG_LEVEL`環境変数（`.env`参照）で明示的にしきい値を指定できるが、未設定時は`NODE_ENV`に応じて自動で決まる: `development`（未設定時のデフォルト）→`debug`、`production`→`info`、`test`→`silent`（Jest実行時にアクセスログでテスト出力が汚れないようにするため）。
- **各レベルは以下の基準で使い分ける:**

  | レベル | 使う場面 |
  |---|---|
  | `DEBUG` | プログラムの不具合（バグ）を直すため。変数の中身、細かい処理の分岐、SQL文の詳細など |
  | `INFO` | システムが正しく動いていることを確認するため。どの順序で何が動いているかを把握する |
  | `WARN` | まだエラーではないが、ディスクの空き容量が減っているなど、このままだと問題が起きそうな状態 |
  | `ERROR` | 処理が失敗した、またはデータが保存できなかったなど、すぐに対応や確認が必要な問題 |
  | `FATAL` | 致命的なエラー。システムがこれ以上動かない、またはデータが壊れるような最悪の状態 |

- アクセスログ自体のレベルは`customLogLevel`でステータスコードに応じて自動判定される: 5xx→`error`、4xx→`warn`、それ以外→`info`。
- **業務エラー（バリデーションエラーなど）は`WARN`で十分。** クライアント起因で想定内・ハンドリング済みのエラー（バリデーション失敗、認証・認可エラーなど、通常4xxで返すもの）は、システムの不具合ではないため`ERROR`まで上げる必要はない。`ERROR`はシステム側の想定外の失敗（5xx）に予約する。
- **フォーマット**: `NODE_ENV === "development"`のときだけ`pino-pretty`で人間可読な整形ログに変換する。それ以外（`test`/`production`）はプレーンなJSON出力にしている。`pino-pretty`はworker threadを使うため、Jest実行時（`test`）に有効化するとハングの原因になりうる点に注意。
- **ログローテーションは実装していない。** `back/`はアプリ自体をまだコンテナ化・デプロイしておらず（`docker-compose.yml`はDBのみ）、標準出力オンリー設計のため。将来コンテナ化・デプロイする際は、Dockerのlog-opts（`max-size`/`max-file`）やホスティング先のログ管理機能に委ねる想定。

#### ログを書く際の必須ルール

1. **どのレイヤー・クラスから出たログかを必ず明示する。** ログを出す全てのクラス（Controller/Service/Filter問わず）は、コンストラクタで`@InjectPinoLogger(ClassName.name)`を使って`PinoLogger`を注入し、そのクラス名を`context`として自動付与させる（`PrismaService`・`AllExceptionsFilter`が実例）。汎用の`console.log`や`context`未指定のロガーは使わない。ただし、アクセスログと重複するだけの内容ならわざわざ注入・ログ出力する必要はない（ルール5参照）。
2. **メタ情報はメッセージ文字列に埋め込まず、必ずオブジェクトの構造化フィールドとして渡す。** `logger.info(\`user ${id} did X\`)`のような文字列連結は禁止。`logger.info({ userId, action: "X" }, "固定の説明文")`のように、第1引数のオブジェクトにキー・バリューとして渡す（メッセージは固定文言にし、検索・集計は構造化フィールド側で行う）。
3. **エラーは発生箇所ごとに個別ログを残さず、1エラーにつき1ログに一本化する。** 各層で`catch`して単純に再throwする場合はそこでログを出さない（同じエラーが何行にもわたって重複記録されるのを防ぐため）。エラーの記録は`src/common/filters/all-exceptions.filter.ts`（`APP_FILTER`としてグローバル登録）に集約しており、`err`（スタックトレース込み）・`statusCode`・`errorType`（例外クラス名）を構造化フィールドとして必ず付与する。`reqId`やリクエスト内容は、AsyncLocalStorageベースの`PinoLogger`がリクエストコンテキストから自動的に引き継ぐため、フィルター側で手動で詰め直す必要はない。
4. **ユーザーの行動を追えるよう、認証済みリクエストのログには必ず`userId`を含める。** 認証ガード/ミドルウェア実装時は、リクエストの早い段階で`PinoLogger.assign({ userId })`を呼ぶ（もしくは`req.user.id`をセットしておけば`logger.config.ts`の`customProps`が自動的に拾う）。一度`assign`すれば、以降そのリクエスト内で発生する全ての層のログ（アクセスログ含む）に`userId`が自動的に乗るため、各ログ呼び出しで毎回`userId`を手動指定する必要はない。
5. **ミドルウェアが自動で出しているログを、アプリ側で重複して出さない。** `pino-http`のautoLoggingが全リクエストの受信・完了（メソッド・パス・ステータス・応答時間）を既に1行で記録しているため、Controller/Serviceで「リクエストを受け付けました」「レスポンスを返しました」のような同内容のログを重ねて出すとノイズになる。アプリ側でログを追加するのは、アクセスログだけでは分からない付加情報（どのビジネスロジックが実行されたか、分岐の結果など）がある場合に限る。

### Biomeとの既知の衝突

- Biomeの`useImportType`ルールは、NestJSがコンストラクタ引数の型からDI用メタデータを生成する仕組み（`emitDecoratorMetadata`）と衝突する。DI対象のクラスをtype-onlyインポート（`import type { Foo } from "./foo"`）にすると実行時の型情報が失われ、`UnknownDependenciesException`でアプリの起動に失敗する。このためリポジトリルートの`biome.json`で`back/src/**`に限り`useImportType`を無効化している。コンストラクタでDIするクラスは常に通常のインポートで書くこと。
- Biomeの標準パーサーは既定でパラメータデコレータ（`constructor(@InjectPinoLogger(Foo.name) private readonly logger: PinoLogger)`のような書き方）を解釈できずパースエラーになる。このため`biome.json`の`back/src/**`向けoverrideで`javascript.parser.unsafeParameterDecoratorsEnabled: true`を設定している。
