import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("子要素のテキストを表示する", () => {
    render(<Badge>基礎</Badge>);
    expect(screen.getByText("基礎")).toBeInTheDocument();
  });

  it("難易度バリアントごとに色クラスが切り替わる", () => {
    const { rerender } = render(<Badge variant="basic">基礎</Badge>);
    expect(screen.getByText("基礎")).toHaveClass(
      "bg-green-100",
      "text-green-800",
    );

    rerender(<Badge variant="practice">実務</Badge>);
    expect(screen.getByText("実務")).toHaveClass(
      "bg-indigo-100",
      "text-indigo-800",
    );

    rerender(<Badge variant="advanced">応用</Badge>);
    expect(screen.getByText("応用")).toHaveClass(
      "bg-amber-100",
      "text-amber-800",
    );
  });

  it("デフォルトはneutralバリアントになる", () => {
    render(<Badge>後回し</Badge>);
    expect(screen.getByText("後回し")).toHaveClass(
      "bg-slate-100",
      "text-slate-500",
    );
  });
});
