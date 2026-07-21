import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqItem } from "./faq-item";

describe("FaqItem", () => {
  it("質問と回答を表示する", () => {
    render(
      <FaqItem
        question="無料で見られる範囲はどこまでですか？"
        answer="各講座のサンプル動画と一部の基礎講座は無料でご覧いただけます。"
      />,
    );

    expect(screen.getByText("Q. 無料で見られる範囲はどこまでですか？")).toBeInTheDocument();
    expect(
      screen.getByText("A. 各講座のサンプル動画と一部の基礎講座は無料でご覧いただけます。"),
    ).toBeInTheDocument();
  });
});
