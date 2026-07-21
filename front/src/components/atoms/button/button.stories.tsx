import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "invert", "onDark"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  args: {
    children: "無料登録して始める",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "料金プランを見る",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "ログイン",
  },
};

export const Small: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "次のレッスンへ →",
  },
};

export const AsLink: Story = {
  args: {
    href: "/auth",
    children: "無料登録して始める",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const OnDark: Story = {
  args: {
    variant: "onDark",
    children: "無料サンプルを見る",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (StoryFn) => (
      <div style={{ background: "#0F172A", padding: 32, borderRadius: 12 }}>
        <StoryFn />
      </div>
    ),
  ],
};

export const Invert: Story = {
  args: {
    variant: "invert",
    children: "無料登録する",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ background: "#4F46E5", padding: 32, borderRadius: 12 }}>
        <StoryFn />
      </div>
    ),
  ],
};
