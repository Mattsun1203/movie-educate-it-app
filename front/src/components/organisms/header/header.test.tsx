import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header } from "./header";

describe("Header", () => {
  it("ロゴとナビゲーション項目を表示する", () => {
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "CodeStep トップページ" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "講座を探す" })).toHaveAttribute(
      "href",
      "/courses",
    );
    expect(screen.getByRole("link", { name: "ブログ" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("currentに一致するナビ項目にaria-current=pageを付与する", () => {
    render(<Header current="blog" />);

    expect(screen.getByRole("link", { name: "ブログ" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "講座を探す" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("未ログイン時はログイン・無料登録ボタンを表示する", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "ログイン" })).toHaveAttribute(
      "href",
      "/auth",
    );
    expect(screen.getByRole("link", { name: "無料登録" })).toHaveAttribute(
      "href",
      "/auth",
    );
  });

  it("ログイン時はマイページリンクとアバターを表示し、ログインボタンは表示しない", () => {
    render(<Header isLoggedIn userInitials="田" />);

    expect(screen.getByRole("link", { name: "マイページ" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(
      screen.getByRole("link", { name: "アカウントメニュー" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("田")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "ログイン" }),
    ).not.toBeInTheDocument();
  });
});
