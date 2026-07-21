import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TestimonialCard } from "./testimonial-card";

const meta = {
  title: "Molecules/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote: "未経験でしたが、順番通りに進めるだけで理解できました。",
    name: "佐藤 様",
    role: "Web制作会社 勤務",
  },
};

export const LongQuote: Story = {
  args: {
    quote:
      "サンプル動画の質が高く、有料プランへの移行に迷いませんでした。実務講座で学んだ内容がそのまま業務で役立っています。",
    name: "鈴木 様",
    role: "営業職から転職",
  },
};
