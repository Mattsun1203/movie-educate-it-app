import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./breadcrumb";

describe("Breadcrumb", () => {
  it("hrefがある項目はリンクとして描画する", () => {
    render(
      <Breadcrumb
        items={[{ label: "ブログ", href: "/blog" }, { label: "記事一覧" }]}
      />,
    );

    expect(screen.getByRole("link", { name: "ブログ" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("hrefがない最後の項目はリンクにせず現在地として表示する", () => {
    render(
      <Breadcrumb
        items={[{ label: "ブログ", href: "/blog" }, { label: "記事一覧" }]}
      />,
    );

    const current = screen.getByText("記事一覧");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("区切り文字を項目数-1個表示する", () => {
    render(
      <Breadcrumb
        items={[
          { label: "ブログ", href: "/blog" },
          { label: "フロントエンド", href: "/blog/articles?category=frontend" },
          { label: "記事詳細" },
        ]}
      />,
    );

    expect(screen.getAllByText("/")).toHaveLength(2);
  });
});
