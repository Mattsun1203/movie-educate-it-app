import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("見出しが表示される", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: "To get started, edit the page.tsx file.",
      }),
    ).toBeInTheDocument();
  });
});
