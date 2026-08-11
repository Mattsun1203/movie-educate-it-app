import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagFilter } from "./tag-filter";

const items = [
  { label: "すべて", href: "/blog/articles", isActive: true },
  { label: "フロントエンド", href: "/blog/articles?category=frontend" },
];

describe("TagFilter", () => {
  it("各項目をリンクとして表示する", () => {
    render(<TagFilter items={items} />);

    expect(screen.getByRole("link", { name: "すべて" })).toHaveAttribute(
      "href",
      "/blog/articles",
    );
    expect(
      screen.getByRole("link", { name: "フロントエンド" }),
    ).toHaveAttribute("href", "/blog/articles?category=frontend");
  });

  it("isActiveな項目にaria-currentを付与する", () => {
    render(<TagFilter items={items} />);

    expect(screen.getByRole("link", { name: "すべて" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "フロントエンド" }),
    ).not.toHaveAttribute("aria-current");
  });
});
