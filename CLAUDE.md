# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ルール

- **CLAUDE向けドキュメント（このファイルを含む）は必ず日本語で記述すること。** コマンドやコード例など英語表記が自然な箇所を除き、説明文は日本語で書く。
- **コードを編集した後は、作業を終える前に必ずリポジトリルートで`pnpm format`を実行すること。** 本プロジェクトにESLintは存在せず、Biomeが`front/`・`back/`双方の唯一のリンター/フォーマッターである。

## リポジトリ構成

本リポジトリはpnpmワークスペースによるモノレポ構成（`pnpm-workspace.yaml`）で、以下の2パッケージからなる。

- `front/` — Next.js 16（App Router）+ React 19 + TypeScriptのフロントエンド。実装済みで稼働中。詳細は`front/CLAUDE.md`を参照。
- `back/` — 現時点では空。将来のバックエンド用に予約されているディレクトリ。

ツールのバージョンはmise（`mise.toml`）で固定している: Node 26.5、pnpm 11.15.1（`package.json`の`packageManager`フィールドと必ず一致させること）。

## コマンド

Biome（フォーマッター兼リンター）はワークスペース全体で共有するルート直下のdevDependency。`front/`ではなく必ずリポジトリルートから実行する。本プロジェクトにESLintは存在せず、Biomeが`front/`・`back/`双方の唯一のリンター/フォーマッターである。

```bash
pnpm format        # biome format --write . （フォーマットを適用）
pnpm format:check  # biome format .        （チェックのみ）
pnpm lint          # biome lint .
pnpm check          # biome check .         （フォーマット + リント + import整理）
```

front固有のコマンド（`dev`, `build`, `test`, `e2e`, `storybook`など）は`front/CLAUDE.md`を参照。
