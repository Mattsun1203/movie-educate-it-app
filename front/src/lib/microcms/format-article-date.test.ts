import { describe, expect, it } from "vitest";
import { formatArticleDate } from "./format-article-date";

describe("formatArticleDate", () => {
  it("ISO日時をYYYY.MM.DD形式に変換する", () => {
    expect(formatArticleDate("2026-07-20T00:00:00.000Z")).toBe("2026.07.20");
  });

  it("月・日が1桁でも0埋めする", () => {
    expect(formatArticleDate("2026-01-05T00:00:00.000Z")).toBe("2026.01.05");
  });
});
