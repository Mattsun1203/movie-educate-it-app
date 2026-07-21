import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/atoms/input";
import { Label } from "./label";

const meta = {
  title: "Atoms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "メールアドレス",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: (args) => (
    <div style={{ width: 280 }}>
      <Label {...args} htmlFor="email" />
      <Input id="email" placeholder="you@example.com" />
    </div>
  ),
};
