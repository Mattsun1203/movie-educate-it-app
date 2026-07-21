import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("イニシャルを表示する", () => {
    render(<Avatar initials="田" />);
    expect(screen.getByText("田")).toBeInTheDocument();
  });

  it("サイズに応じてクラスが切り替わる", () => {
    const { rerender } = render(<Avatar initials="田" size="sm" />);
    expect(screen.getByText("田")).toHaveClass("h-9", "w-9");

    rerender(<Avatar initials="田" size="md" />);
    expect(screen.getByText("田")).toHaveClass("h-12", "w-12");
  });
});
