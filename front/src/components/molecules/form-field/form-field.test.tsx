import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FormField } from "./form-field";

describe("FormField", () => {
  it("ラベルと入力欄が関連付けられる", () => {
    render(<FormField id="email" label="メールアドレス" />);
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
  });

  it("入力欄に値を入力できる", async () => {
    const user = userEvent.setup();
    render(<FormField id="email" label="メールアドレス" />);

    const input = screen.getByLabelText("メールアドレス");
    await user.type(input, "teachmatsuyu@gmail.com");

    expect(input).toHaveValue("teachmatsuyu@gmail.com");
  });

  it("helperTextを渡すと補足文が表示され、入力欄と関連付けられる", () => {
    render(
      <FormField id="password" label="パスワード" helperText="8文字以上" />,
    );

    const input = screen.getByLabelText("パスワード");
    const helper = screen.getByText("8文字以上");

    expect(helper).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("inputPropsで入力欄の属性を上書きできる", () => {
    render(
      <FormField
        id="password"
        label="パスワード"
        inputProps={{ type: "password", placeholder: "8文字以上" }}
      />,
    );

    expect(screen.getByPlaceholderText("8文字以上")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
