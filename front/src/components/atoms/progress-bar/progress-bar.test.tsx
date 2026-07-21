import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./progress-bar";

describe("ProgressBar", () => {
  it("valueに応じたaria属性を持つ", () => {
    render(<ProgressBar value={41} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "41");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("100を超える値は100に丸められる", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("0未満の値は0に丸められる", () => {
    render(<ProgressBar value={-20} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
});
