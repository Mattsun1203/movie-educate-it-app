import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArticleCard } from "./article-card";

describe("ArticleCard", () => {
  it("タイトル・カテゴリー・日付を表示する", () => {
    render(
      <ArticleCard
        href="/blog/react-basics"
        title="未経験からReactを学ぶときに押さえておきたい5つのポイント"
        category="フロントエンド"
        date="2026.07.20"
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/blog/react-basics",
    );
    expect(
      screen.getByText(
        "未経験からReactを学ぶときに押さえておきたい5つのポイント",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("フロントエンド")).toBeInTheDocument();
    expect(screen.getByText("2026.07.20")).toBeInTheDocument();
  });

  it("size=featuredかつexcerptを指定すると本文抜粋を表示する", () => {
    render(
      <ArticleCard
        href="/blog/react-basics"
        title="未経験からReactを学ぶときに押さえておきたい5つのポイント"
        category="フロントエンド"
        date="2026.07.20"
        excerpt="大切な考え方を解説します。"
        size="featured"
      />,
    );

    expect(screen.getByText("大切な考え方を解説します。")).toBeInTheDocument();
  });

  it("デフォルトサイズではexcerptを渡しても表示しない", () => {
    render(
      <ArticleCard
        href="/blog/react-basics"
        title="未経験からReactを学ぶときに押さえておきたい5つのポイント"
        category="フロントエンド"
        date="2026.07.20"
        excerpt="大切な考え方を解説します。"
      />,
    );

    expect(
      screen.queryByText("大切な考え方を解説します。"),
    ).not.toBeInTheDocument();
  });

  it("未知のカテゴリーでもneutralバッジで描画する", () => {
    render(
      <ArticleCard
        href="/blog/misc"
        title="タイトル"
        category="未分類"
        date="2026.01.01"
      />,
    );

    expect(screen.getByText("未分類")).toBeInTheDocument();
  });
});
