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

## フォーマット・リント

本プロジェクトにESLint/Prettierは存在せず、Biomeがフォーマッター/リンターを兼ねる。リポジトリルートで実行すること（詳細はルートの`CLAUDE.md`を参照）。

```bash
pnpm format
pnpm lint
```
