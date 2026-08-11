# CLAUDE.md

このディレクトリ（`front/src/components/`）配下で作業する際のルール。全体のルールはリポジトリルートの`CLAUDE.md`も参照すること。

## ルール

- **このディレクトリ配下のコンポーネント（`atoms/`・`molecules/`、および将来追加されるアトミックレベルすべて）は、必ず`*.test.tsx`と`*.stories.tsx`をセットで用意すること。** コンポーネントを追加・リネームする際は、同じ変更の中で両方のファイルを追加・更新する。片方だけを欠かしてはならない。
- **`organisms/`配下のような複数ページで共有される共通コンポーネント（header, footer等）を新規作成する場合は、それを利用するページ側の実装とはコミットを分けること。** 共通コンポーネント自体の追加コミットと、それを組み込んでページを実装するコミットを分離する。

## 構成

- `atoms/` — 最小単位の部品（button, badge, input, label, avatar, progress-bar, logo, nav-link）
- `molecules/` — atomsを組み合わせた部品（form-field, course-card, testimonial-card, faq-item, lesson-list-item）
- `organisms/` — molecules/atomsを組み合わせたページ共通の大きな部品（header, footer）

各コンポーネントディレクトリの中身:

- `*.tsx` — コンポーネント本体
- `*.test.tsx` — Vitest + Testing Libraryによるユニットテスト
- `*.stories.tsx` — Storybookのstory（`@storybook/addon-vitest`により`pnpm test`実行時にも実際のブラウザテストとして実行される）

各階層は`index.ts`のバレルファイル（`atoms/index.ts`, `molecules/index.ts`, `organisms/index.ts`）ですべてを再エクスポートする。
