import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialCard } from "./testimonial-card";

describe("TestimonialCard", () => {
  it("引用文・氏名・肩書きを表示する", () => {
    render(
      <TestimonialCard
        quote="未経験でしたが、順番通りに進めるだけで理解できました。"
        name="佐藤 様"
        role="Web制作会社 勤務"
      />,
    );

    expect(
      screen.getByText("未経験でしたが、順番通りに進めるだけで理解できました。", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("佐藤 様")).toBeInTheDocument();
    expect(screen.getByText("Web制作会社 勤務")).toBeInTheDocument();
  });

  it("氏名の頭文字をアバターのイニシャルとして表示する", () => {
    render(<TestimonialCard quote="実務講座が役立っています。" name="鈴木 様" role="営業職から転職" />);
    expect(screen.getByText("鈴")).toBeInTheDocument();
  });
});
