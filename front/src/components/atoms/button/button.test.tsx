import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("ボタン要素として描画され、クリックできる", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>無料登録する</Button>);

    const button = screen.getByRole("button", { name: "無料登録する" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("hrefを指定するとリンクとして描画される", () => {
    render(
      <Button href="/auth" variant="invert">
        無料登録して始める
      </Button>,
    );

    const link = screen.getByRole("link", { name: "無料登録して始める" });
    expect(link).toHaveAttribute("href", "/auth");
  });

  it("variantに応じたスタイルが適用される", () => {
    render(<Button variant="secondary">料金プランを見る</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-slate-200");
  });

  it("disabledを指定すると操作できない", () => {
    render(<Button disabled>無料で登録する</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
