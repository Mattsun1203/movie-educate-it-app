import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonListItem } from "./lesson-list-item";

describe("LessonListItem", () => {
  it("レッスンタイトルと再生時間を表示する", () => {
    render(<LessonListItem title="状態管理とデータフロー" duration="8分" status="upcoming" />);
    expect(screen.getByText("状態管理とデータフロー")).toBeInTheDocument();
    expect(screen.getByText("8分")).toBeInTheDocument();
  });

  it("statusごとにアイコンとアクセシブルなラベルが切り替わる", () => {
    const { rerender } = render(<LessonListItem title="環境構築" duration="8分" status="completed" />);
    expect(screen.getByLabelText("視聴済み")).toHaveTextContent("✓");

    rerender(<LessonListItem title="環境構築" duration="8分" status="current" />);
    expect(screen.getByLabelText("再生中")).toHaveTextContent("▶");

    rerender(<LessonListItem title="環境構築" duration="8分" status="upcoming" />);
    expect(screen.getByLabelText("未視聴")).toHaveTextContent("○");
  });

  it("再生中のレッスンは強調表示される", () => {
    render(<LessonListItem title="状態管理とデータフロー" duration="8分" status="current" />);
    expect(screen.getByText("状態管理とデータフロー")).toHaveClass("font-bold");
  });
});
