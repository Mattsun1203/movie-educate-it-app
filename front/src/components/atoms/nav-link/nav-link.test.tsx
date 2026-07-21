import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("指定したhrefへのリンクを描画する", () => {
    render(<NavLink href="/courses">講座を探す</NavLink>);
    expect(screen.getByRole("link", { name: "講座を探す" })).toHaveAttribute("href", "/courses");
  });

  it("isActiveの場合はaria-currentとアクティブなスタイルを持つ", () => {
    render(
      <NavLink href="/courses" isActive>
        講座を探す
      </NavLink>,
    );

    const link = screen.getByRole("link", { name: "講座を探す" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("text-indigo-700");
  });

  it("非アクティブの場合はaria-currentを持たない", () => {
    render(<NavLink href="/pricing">料金プラン</NavLink>);
    expect(screen.getByRole("link", { name: "料金プラン" })).not.toHaveAttribute("aria-current");
  });
});
