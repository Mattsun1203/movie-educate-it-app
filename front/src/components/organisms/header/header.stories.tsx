import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./header";

const meta = {
  title: "Organisms/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    current: {
      control: "select",
      options: ["courses", "roadmap", "pricing", "faq", "blog", "dashboard"],
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    current: "blog",
  },
};

export const LoggedIn: Story = {
  args: {
    current: "courses",
    isLoggedIn: true,
    userInitials: "田",
  },
};
