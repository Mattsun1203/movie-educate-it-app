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

### Biomeとの既知の衝突

Biomeの`useImportType`ルールは、NestJSがコンストラクタ引数の型からDI用メタデータを生成する仕組み（`emitDecoratorMetadata`）と衝突する。DI対象のクラスをtype-onlyインポート（`import type { Foo } from "./foo"`）にすると実行時の型情報が失われ、`UnknownDependenciesException`でアプリの起動に失敗する。このためリポジトリルートの`biome.json`で`back/src/**`に限り`useImportType`を無効化している。コンストラクタでDIするクラスは常に通常のインポートで書くこと。
