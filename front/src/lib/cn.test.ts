import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("複数のクラス名をスペース区切りで結合する", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("falsy な値を除外する", () => {
    expect(cn("flex", false, null, undefined, "gap-2")).toBe("flex gap-2");
  });
});
