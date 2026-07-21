# CLAUDE.md

このファイルは`front/`配下で作業する際のガイド。全体のルールはリポジトリルートの`CLAUDE.md`を参照すること。コンポーネント関連の追加ルールは`src/components/CLAUDE.md`を参照。

`front/`はNext.js 16（App Router）+ React 19 + TypeScriptのフロントエンド。

## コマンド

コマンドはすべて`front/`ディレクトリから実行する（Biomeのフォーマット/リントコマンドはリポジトリルートから実行するため、ルートの`CLAUDE.md`を参照）。

```bash
pnpm dev              # next dev
pnpm build            # next build
pnpm test             # vitest run（ユニットテスト + Storybookのインタラクションテスト）
pnpm test:watch       # vitest（ウォッチモード）
pnpm test:ui          # vitest --ui
pnpm e2e               # playwright test
pnpm e2e:ui             # playwright test --ui
pnpm storybook         # storybook dev -p 6006
pnpm build-storybook    # storybook build
```

単一のユニットテストファイルのみ実行する場合: `pnpm test src/components/atoms/button/button.test.tsx`

## アーキテクチャ

### コンポーネント構成

コンポーネントはアトミックデザインに従い、`src/components/`配下に置かれている（`atoms/`, `molecules/`）。ルールと詳細は`src/components/CLAUDE.md`を参照。

クラス名の合成にはローカルの`cn()`ヘルパー（`src/lib/cn.ts`）を使う。`clsx`や`tailwind-merge`ではなく、`filter(Boolean).join(" ")`だけの最小実装である点に注意。

スタイリングはTailwind CSS v4。`src/app/globals.css`内で`@import "tailwindcss"`と`@theme inline`により設定している（`tailwind.config.*`ファイルは存在せず、v4のCSSベース設定方式を採用）。パスエイリアス`@/*`は`src/*`を指す。

### テスト構成

Vitestは`vitest.config.ts`で**マルチプロジェクト構成**になっている。

1. 通常のユニットテスト用のjsdomプロジェクト（対象: `src/**/*.test.{ts,tsx}`）。`vitest.setup.ts`でjest-domのマッチャーとRTLのcleanupをセットアップしている。
2. `storybook`プロジェクト。`@storybook/addon-vitest`により、すべての`*.stories.tsx`ファイルを実ブラウザ上のインタラクションテストとして実行する。ブラウザプロバイダーには`@vitest/browser-playwright`（Playwright/Chromium）を使用。

つまりStorybookのstoryは単なるドキュメントではなく、`pnpm test`実行時に実際にテストとして実行される。

Storybook自体の設定は`.storybook/`にある。`main.ts`（フレームワークは`@storybook/nextjs-vite`、addonsはa11y・docs・vitest・chromatic・mcp）と`preview.tsx`（`globals.css`をimportしており、これによりStorybook上でもTailwindのスタイルが反映される。`globals.css`を移動・リネームする際はこのimportを必ず維持すること）。

E2Eテスト（Playwright）は`e2e/`配下にあり、実行時にNext.jsの開発サーバーを自動起動する（`playwright.config.ts`の`webServer`設定）。

### Biome設定に関する補足

リポジトリルートの`biome.json`では`css.parser.tailwindDirectives: true`を設定している。これは`src/app/globals.css`がTailwind v4の`@theme inline`アトルールを使用しており、Biomeの標準のCSSパーサーはこれを未対応としてエラーにするために必要な設定である。
