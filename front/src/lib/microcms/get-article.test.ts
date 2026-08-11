import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getArticle } from "./get-article";

describe("getArticle", () => {
  it("指定したIDの記事を取得する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles/article-1", () =>
        HttpResponse.json({
          id: "article-1",
          title: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
          content: "<p>本文</p>",
          category: { id: "frontend", name: "フロントエンド" },
          publishedAt: "2026-07-20T00:00:00.000Z",
          createdAt: "2026-07-20T00:00:00.000Z",
          updatedAt: "2026-07-20T00:00:00.000Z",
        }),
      ),
    );

    const article = await getArticle("article-1");

    expect(article?.title).toBe(
      "未経験からReactを学ぶときに押さえておきたい5つのポイント",
    );
    expect(article?.category.name).toBe("フロントエンド");
  });

  it("存在しないIDの場合はnullを返す", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles/not-found", () =>
        HttpResponse.json({ message: "not found" }, { status: 404 }),
      ),
    );

    await expect(getArticle("not-found")).resolves.toBeNull();
  });
});
