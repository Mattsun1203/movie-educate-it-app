import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

describe("Logo", () => {
  it("サービス名を表示する", () => {
    render(<Logo />);
    expect(screen.getByText("CodeStep")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});
