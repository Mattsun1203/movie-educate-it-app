import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/atoms/input";
import { Label } from "./label";

describe("Label", () => {
  it("htmlForで紐づく入力欄をアクセシブルネームとして関連付ける", () => {
    render(
      <>
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" />
      </>,
    );

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
  });
});
