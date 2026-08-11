import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

describe("Logo", () => {
  it("サービス名を表示する", () => {
    render(<Logo />);
    expect(screen.getByText("CodeStep")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("デフォルトではダーク文字色で表示する", () => {
    render(<Logo />);
    expect(screen.getByText("CodeStep")).toHaveClass("text-slate-900");
  });

  it("variant=onDarkのときライト文字色で表示する", () => {
    render(<Logo variant="onDark" />);
    expect(screen.getByText("CodeStep")).toHaveClass("text-slate-100");
  });
});
