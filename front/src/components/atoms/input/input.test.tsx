import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("入力した値が反映される", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="you@example.com" />);

    const input = screen.getByPlaceholderText("you@example.com");
    await user.type(input, "teachmatsuyu@gmail.com");

    expect(input).toHaveValue("teachmatsuyu@gmail.com");
  });

  it("refをDOM要素に転送する", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("type属性を指定できる", () => {
    render(<Input type="password" placeholder="8文字以上" />);
    expect(screen.getByPlaceholderText("8文字以上")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
