import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CourseCard } from "./course-card";

const meta = {
  title: "Molecules/CourseCard",
  component: CourseCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    level: {
      control: "select",
      options: ["基礎", "実務", "応用"],
    },
    progress: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  decorators: [
    (StoryFn) => (
      <div style={{ width: 320 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    href: "/courses/html-css",
    title: "HTML/CSSではじめるWebサイト制作",
    description: "マークアップとスタイリングの基本を実践形式で習得。",
    level: "基礎",
    duration: "全12回",
    isFree: true,
  },
};

export const Practice: Story = {
  args: {
    href: "/courses/react-practice",
    title: "React実践開発 コンポーネント設計",
    description: "状態管理・API連携まで実務水準で構築する。",
    level: "実務",
    duration: "全20回",
  },
};

export const Advanced: Story = {
  args: {
    href: "/courses/performance",
    title: "パフォーマンス最適化と計測",
    description: "Core Web Vitalsをもとにした改善の進め方。",
    level: "応用",
    duration: "全10回",
  },
};

export const WithProgress: Story = {
  args: {
    href: "/courses/js-basic",
    title: "JavaScript基礎からDOM操作まで",
    description: "変数・関数から画面操作まで、手を動かして学ぶ。",
    level: "基礎",
    duration: "全15回",
    isFree: true,
    progress: 40,
  },
};
