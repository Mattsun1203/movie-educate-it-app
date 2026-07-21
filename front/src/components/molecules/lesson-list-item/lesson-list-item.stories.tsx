import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LessonListItem } from "./lesson-list-item";

const meta = {
  title: "Molecules/LessonListItem",
  component: LessonListItem,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["completed", "current", "upcoming"],
    },
  },
  decorators: [
    (StoryFn) => (
      <div
        style={{
          width: 320,
          background: "#1E293B",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof LessonListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
  args: {
    title: "イントロダクションと環境構築",
    duration: "8分",
    status: "completed",
  },
};

export const Current: Story = {
  args: {
    title: "状態管理とデータフロー — Reduxの導入",
    duration: "10分",
    status: "current",
  },
};

export const Upcoming: Story = {
  args: {
    title: "API連携と非同期処理",
    duration: "11分",
    status: "upcoming",
  },
};

export const LessonList: Story = {
  args: {
    title: "イントロダクションと環境構築",
    duration: "8分",
    status: "completed",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <LessonListItem
        title="イントロダクションと環境構築"
        duration="8分"
        status="completed"
      />
      <LessonListItem
        title="コンポーネント設計の基本方針"
        duration="9分"
        status="completed"
      />
      <LessonListItem
        title="状態管理とデータフロー — Reduxの導入"
        duration="10分"
        status="current"
      />
      <LessonListItem
        title="API連携と非同期処理"
        duration="11分"
        status="upcoming"
      />
      <LessonListItem
        title="フォームとバリデーション"
        duration="12分"
        status="upcoming"
      />
      <LessonListItem
        title="テストとデプロイの基本"
        duration="13分"
        status="upcoming"
      />
    </div>
  ),
};
