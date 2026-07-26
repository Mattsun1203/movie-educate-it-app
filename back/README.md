# back

CodeStepのバックエンド。NestJS + Prismaで構築する。

## セットアップ

```bash
$ pnpm install
```

## 起動

```bash
# 開発モード
$ pnpm run start

# ウォッチモード
$ pnpm run start:dev

# 本番モード
$ pnpm run start:prod
```

## テスト

```bash
# ユニットテスト
$ pnpm run test

# E2Eテスト
$ pnpm run test:e2e

# カバレッジ
$ pnpm run test:cov
```

E2Eテストは[Testcontainers](https://node.testcontainers.org/)によりPostgreSQLコンテナを自動起動し、マイグレーション適用後にテストを実行、終了後にコンテナを破棄する。実行にはDockerが起動している必要がある（`docker-compose.yml`のDB起動は不要）。

## フォーマット・リント

本プロジェクトにESLint/Prettierは存在せず、Biomeがフォーマッター/リンターを兼ねる。リポジトリルートで実行すること（詳細はルートの`CLAUDE.md`を参照）。

```bash
pnpm format
pnpm lint
```
