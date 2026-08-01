# back

CodeStepのバックエンド。Hono + Prismaで構築する。デプロイ先はCloudflare Workers + Cloudflare Hyperdrive（PostgreSQLへのコネクションプーリング）で、DB本体はNeonを使う想定。ローカル開発はDocker上のPostgreSQLを使う。

## セットアップ

```bash
$ pnpm install
```

### 初回のみ: Cloudflare / Neon / ローカルDBのセットアップ

1. `wrangler login`（ブラウザ認証）
2. `wrangler hyperdrive create <name> --connection-string="<Neonの本番用接続文字列>"` を実行し、出力された`id`を`wrangler.jsonc`の`hyperdrive[0].id`に設定する
3. `docker compose up -d`でローカルPostgreSQLを起動する
4. `.env.example`を`.env`に、`.dev.vars.example`を`.dev.vars`にコピーする（どちらもローカルDockerのPostgreSQLを指す値が初期設定済み）
5. Neonに`develop`・`main`の2ブランチを用意し、それぞれに`pnpm db:migrate:deploy`（DATABASE_URLをNeonに向けた上で、後述）でスキーマを適用しておく
6. GitHubリポジトリのSecrets/Variablesに`NEON_API_KEY`（Secret）・`NEON_PROJECT_ID`（Variable）を登録する（CIワークフローが使用）

## 起動

```bash
# 開発モード（ローカルでWorkersランタイムを再現して起動、DBはdocker-composeのPostgreSQL）
$ pnpm run dev

# デプロイ
$ pnpm run deploy
```

## テスト

```bash
# 既定: DBを使わないモックテスト（追加設定不要）
$ pnpm run test

# 任意のDB（ローカルDocker、Neonの任意のブランチなど）に対して実行したい場合
$ CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="<接続文字列>" pnpm run test
```

[`@cloudflare/vitest-pool-workers`](https://developers.cloudflare.com/workers/testing/vitest-integration/)により、実際のCloudflare Workersランタイム（workerd）上でテストを実行する。CI（`.github/workflows/back-test.yml`）ではNeonの`develop`ブランチから使い捨てブランチを複製し、実DBに対する結合テストとして実行したのち、成功・失敗を問わずブランチを削除する。

## マイグレーション

```bash
# ローカル: 新規マイグレーションの作成・適用（ローカルDockerのPostgreSQLに対して）
$ pnpm db:migrate

# Neonのdevelop/mainなど共有環境: 既存マイグレーションの適用のみ
$ DATABASE_URL="<Neonの接続文字列>" pnpm db:migrate:deploy
```

## フォーマット・リント

本プロジェクトにESLint/Prettierは存在せず、Biomeがフォーマッター/リンターを兼ねる。リポジトリルートで実行すること（詳細はルートの`CLAUDE.md`を参照）。

```bash
pnpm format
pnpm lint
```
