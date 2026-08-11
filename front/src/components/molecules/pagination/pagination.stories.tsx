import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./pagination";

const meta = {
  title: "Molecules/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  args: {
    hrefForPage: (page: number) => `/blog/articles?page=${page}`,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 3,
    totalPages: 3,
  },
};
