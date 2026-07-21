import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaqItem } from "./faq-item";

const meta = {
  title: "Molecules/FaqItem",
  component: FaqItem,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 480 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof FaqItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: "無料で見られる範囲はどこまでですか？",
    answer: "各講座のサンプル動画と一部の基礎講座は無料でご覧いただけます。",
  },
};

export const FaqList: Story = {
  args: {
    question: "無料で見られる範囲はどこまでですか？",
    answer: "各講座のサンプル動画と一部の基礎講座は無料でご覧いただけます。",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FaqItem
        question="無料で見られる範囲はどこまでですか？"
        answer="各講座のサンプル動画と一部の基礎講座は無料でご覧いただけます。"
      />
      <FaqItem
        question="サブスクはいつでも解約できますか？"
        answer="はい、マイページからいつでも解約可能です。日割り返金はございません。"
      />
      <FaqItem
        question="プログラミング未経験でも大丈夫ですか？"
        answer="基礎講座から順番に進めば無理なく学習を進められます。"
      />
    </div>
  ),
};
