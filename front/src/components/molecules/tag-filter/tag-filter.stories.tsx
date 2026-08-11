import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TagFilter } from "./tag-filter";

const meta = {
  title: "Molecules/TagFilter",
  component: TagFilter,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TagFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "すべて", href: "/blog/articles", isActive: true },
      { label: "フロントエンド", href: "/blog/articles?category=frontend" },
      { label: "学習法", href: "/blog/articles?category=study" },
      { label: "お知らせ", href: "/blog/articles?category=news" },
    ],
  },
};
