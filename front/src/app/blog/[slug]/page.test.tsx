import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import BlogDetailPage from "./page";

const category = { id: "frontend", name: "フロントエンド" };

const currentArticle = {
  id: "article-2",
  title: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
  content: "<p>本文です。</p><h2>見出し</h2><p>続きの本文です。</p>",
  category,
  tags: ["React", "初心者向け"],
  authorName: "CodeStep編集部",
  readingMinutes: 6,
  publishedAt: "2026-07-20T00:00:00.000Z",
  createdAt: "2026-07-20T00:00:00.000Z",
  updatedAt: "2026-07-20T00:00:00.000Z",
};

const categoryArticles = [
  {
    id: "article-1",
    title: "JavaScript基礎からDOM操作まで学ぶ順番とは",
    content: "<p>本文</p>",
    category,
    publishedAt: "2026-07-25T00:00:00.000Z",
    createdAt: "2026-07-25T00:00:00.000Z",
    updatedAt: "2026-07-25T00:00:00.000Z",
  },
  currentArticle,
  {
    id: "article-3",
    title: "TypeScript導入で得られる3つのメリット",
    content: "<p>本文</p>",
    category,
    publishedAt: "2026-07-08T00:00:00.000Z",
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-07-08T00:00:00.000Z",
  },
];

function mockArticleEndpoints() {
  server.use(
    http.get("https://dummy.microcms.io/api/v1/articles/article-2", () =>
      HttpResponse.json(currentArticle),
    ),
    http.get("https://dummy.microcms.io/api/v1/articles", () =>
      HttpResponse.json({
        contents: categoryArticles,
        totalCount: categoryArticles.length,
        offset: 0,
        limit: 100,
      }),
    ),
  );
}

describe("BlogDetailPage", () => {
  it("パンくず・タイトル・本文を表示する", async () => {
    mockArticleEndpoints();

    render(
      await BlogDetailPage({
        params: Promise.resolve({ slug: "article-2" }),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "未経験からReactを学ぶときに押さえておきたい5つのポイント",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "フロントエンド" }),
    ).toHaveAttribute("href", "/blog/articles?category=frontend");
    expect(screen.getByText("続きの本文です。")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("前後の記事へのリンクを表示する", async () => {
    mockArticleEndpoints();

    render(
      await BlogDetailPage({
        params: Promise.resolve({ slug: "article-2" }),
      }),
    );

    expect(
      screen.getByRole("link", { name: /前の記事.*JavaScript基礎/ }),
    ).toHaveAttribute("href", "/blog/article-1");
    expect(
      screen.getByRole("link", { name: /次の記事.*TypeScript導入/ }),
    ).toHaveAttribute("href", "/blog/article-3");
  });

  it("記事が存在しない場合はnotFoundを呼び出す", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles/not-exist", () =>
        HttpResponse.json({ message: "not found" }, { status: 404 }),
      ),
    );

    await expect(
      BlogDetailPage({ params: Promise.resolve({ slug: "not-exist" }) }),
    ).rejects.toThrow();
  });
});
