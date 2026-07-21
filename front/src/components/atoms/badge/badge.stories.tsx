import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["basic", "practice", "advanced", "success", "neutral", "onDark"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    variant: "basic",
    children: "基礎",
  },
};

export const Practice: Story = {
  args: {
    variant: "practice",
    children: "実務",
  },
};

export const Advanced: Story = {
  args: {
    variant: "advanced",
    children: "応用",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "無料あり",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "後回し",
  },
};

export const OnDark: Story = {
  args: {
    variant: "onDark",
    children: "CHAPTER 3 · レッスン2",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ background: "#0F172A", padding: 24, borderRadius: 12 }}>
        <StoryFn />
      </div>
    ),
  ],
};
