import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./footer";

describe("Footer", () => {
  it("サービス名とキャッチコピーを表示する", () => {
    render(<Footer />);

    expect(screen.getByText("CodeStep")).toBeInTheDocument();
    expect(screen.getByText(/現場で使える実務スキルを/)).toBeInTheDocument();
  });

  it("サービス・サポート・規約の各リンクを表示する", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "講座を探す" })).toHaveAttribute(
      "href",
      "/courses",
    );
    expect(screen.getByRole("link", { name: "料金プラン" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("link", { name: "よくある質問" })).toHaveAttribute(
      "href",
      "/#faq",
    );
    expect(screen.getByRole("link", { name: "利用規約" })).toHaveAttribute(
      "href",
      "#",
    );
  });

  it("コピーライトを表示する", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 CodeStep, Inc\./)).toBeInTheDocument();
  });
});
