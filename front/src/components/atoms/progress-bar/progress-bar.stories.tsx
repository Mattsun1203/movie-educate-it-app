import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./progress-bar";

const meta = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 280 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const InProgress: Story = {
  args: {
    value: 41,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const OutOfRange: Story = {
  args: {
    value: 150,
  },
};
