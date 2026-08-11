import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getCategories } from "./get-categories";

describe("getCategories", () => {
  it("カテゴリー一覧を取得する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/categories", () =>
        HttpResponse.json({
          contents: [
            { id: "frontend", name: "フロントエンド" },
            { id: "study", name: "学習法" },
            { id: "news", name: "お知らせ" },
          ],
          totalCount: 3,
          offset: 0,
          limit: 100,
        }),
      ),
    );

    const categories = await getCategories();

    expect(categories).toEqual([
      { id: "frontend", name: "フロントエンド" },
      { id: "study", name: "学習法" },
      { id: "news", name: "お知らせ" },
    ]);
  });
});
