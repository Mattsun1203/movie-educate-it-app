import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb } from "./breadcrumb";

const meta = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoLevels: Story = {
  args: {
    items: [{ label: "ブログ", href: "/blog" }, { label: "記事一覧" }],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "ブログ", href: "/blog" },
      { label: "フロントエンド", href: "/blog/articles?category=frontend" },
      { label: "記事詳細" },
    ],
  },
};
