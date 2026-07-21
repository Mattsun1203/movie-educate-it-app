import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavLink } from "./nav-link";

const meta = {
  title: "Atoms/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
  },
  args: {
    href: "/courses",
    children: "講座を探す",
  },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
  },
};

export const NavigationBar: Story = {
  render: () => (
    <nav style={{ display: "flex", gap: 28 }}>
      <NavLink href="/courses" isActive>
        講座を探す
      </NavLink>
      <NavLink href="/#roadmap">学習の進め方</NavLink>
      <NavLink href="/pricing">料金プラン</NavLink>
      <NavLink href="/#faq">よくある質問</NavLink>
    </nav>
  ),
};
