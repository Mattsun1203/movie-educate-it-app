import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getArticles } from "./get-articles";

describe("getArticles", () => {
  it("記事一覧を取得する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles", () =>
        HttpResponse.json({
          contents: [
            {
              id: "article-1",
              title: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
              content: "<p>本文</p>",
              category: { id: "frontend", name: "フロントエンド" },
              publishedAt: "2026-07-20T00:00:00.000Z",
              createdAt: "2026-07-20T00:00:00.000Z",
              updatedAt: "2026-07-20T00:00:00.000Z",
            },
          ],
          totalCount: 1,
          offset: 0,
          limit: 9,
        }),
      ),
    );

    const result = await getArticles();

    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].title).toBe(
      "未経験からReactを学ぶときに押さえておきたい5つのポイント",
    );
    expect(result.articles[0].category.name).toBe("フロントエンド");
    expect(result.totalCount).toBe(1);
  });

  it("categoryIdを指定するとfiltersクエリを付与して取得する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("filters")).toBe(
          "category[equals]frontend",
        );
        return HttpResponse.json({
          contents: [],
          totalCount: 0,
          offset: 0,
          limit: 9,
        });
      }),
    );

    await getArticles({ categoryId: "frontend" });
  });

  it("queryを指定するとキーワード検索クエリを付与して取得する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles", ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("q")).toBe("React");
        return HttpResponse.json({
          contents: [],
          totalCount: 0,
          offset: 0,
          limit: 9,
        });
      }),
    );

    await getArticles({ query: "React" });
  });
});
