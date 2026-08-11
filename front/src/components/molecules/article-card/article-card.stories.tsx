import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleCard } from "./article-card";

const meta = {
  title: "Molecules/ArticleCard",
  component: ArticleCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "featured"],
    },
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <StoryFn />
      </div>
    ),
  ],
  args: {
    href: "/blog/react-basics",
    title: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
    category: "フロントエンド",
    date: "2026.07.20",
  },
};

export const Announcement: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <StoryFn />
      </div>
    ),
  ],
  args: {
    href: "/blog/new-course",
    title: "新講座「テスト設計とCI導入」を公開しました",
    category: "お知らせ",
    date: "2026.06.20",
  },
};

export const Featured: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ width: 720 }}>
        <StoryFn />
      </div>
    ),
  ],
  args: {
    href: "/blog/react-basics",
    title: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
    category: "フロントエンド",
    date: "2026.07.20",
    excerpt:
      "Reactを学び始めるとき、多くの初心者は文法だけを追いかけて挫折してしまいます。大切な考え方を解説します。",
    size: "featured",
  },
};
