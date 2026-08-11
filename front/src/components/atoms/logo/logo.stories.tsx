import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./logo";

const meta = {
  title: "Atoms/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "onDark"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDark: Story = {
  args: {
    variant: "onDark",
  },
  decorators: [
    (StoryFn) => (
      <div style={{ background: "#0F172A", padding: 24 }}>
        <StoryFn />
      </div>
    ),
  ],
};
