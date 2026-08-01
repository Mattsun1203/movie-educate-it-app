# back

CodeStepのバックエンド。Hono + Prismaで構築する。

## セットアップ

```bash
$ pnpm install
```

## 起動

```bash
# 開発モード（ファイル変更を検知して自動再起動）
$ pnpm run dev

# ビルド
$ pnpm run build

# 本番モード（要ビルド済み）
$ pnpm run start
```

## テスト

```bash
# ユニットテスト（DB不要）
$ pnpm run test

# E2Eテスト
$ pnpm run test:e2e
```

E2Eテストは[Testcontainers](https://node.testcontainers.org/)によりPostgreSQLコンテナを自動起動し、マイグレーション適用後にテストを実行、終了後にコンテナを破棄する。実行にはDockerが起動している必要がある（`docker-compose.yml`のDB起動は不要）。

## フォーマット・リント

本プロジェクトにESLint/Prettierは存在せず、Biomeがフォーマッター/リンターを兼ねる。リポジトリルートで実行すること（詳細はルートの`CLAUDE.md`を参照）。

```bash
pnpm format
pnpm lint
```
