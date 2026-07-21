import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "you@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "8文字以上",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "teachmatsuyu@gmail.com",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "you@example.com",
    disabled: true,
  },
};
