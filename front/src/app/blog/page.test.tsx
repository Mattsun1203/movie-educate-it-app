import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import BlogTopPage from "./page";

const mockArticles = Array.from({ length: 7 }, (_, i) => ({
  id: `article-${i + 1}`,
  title: `記事タイトル${i + 1}`,
  content: "<p>本文</p>",
  category:
    i === 0
      ? { id: "frontend", name: "フロントエンド" }
      : { id: "study", name: "学習法" },
  excerpt: i === 0 ? "注目記事の抜粋文です。" : undefined,
  publishedAt: "2026-07-20T00:00:00.000Z",
  createdAt: "2026-07-20T00:00:00.000Z",
  updatedAt: "2026-07-20T00:00:00.000Z",
}));

const mockCategories = [
  { id: "frontend", name: "フロントエンド" },
  { id: "study", name: "学習法" },
  { id: "news", name: "お知らせ" },
];

function mockCmsHandlers() {
  server.use(
    http.get("https://dummy.microcms.io/api/v1/articles", () =>
      HttpResponse.json({
        contents: mockArticles,
        totalCount: mockArticles.length,
        offset: 0,
        limit: 7,
      }),
    ),
    http.get("https://dummy.microcms.io/api/v1/categories", () =>
      HttpResponse.json({
        contents: mockCategories,
        totalCount: mockCategories.length,
        offset: 0,
        limit: 100,
      }),
    ),
  );
}

describe("BlogTopPage", () => {
  it("注目記事と新着記事一覧を表示する", async () => {
    mockCmsHandlers();

    render(await BlogTopPage());

    expect(
      screen.getByRole("heading", { name: "記事タイトル1" }),
    ).toBeInTheDocument();
    expect(screen.getByText("注目記事の抜粋文です。")).toBeInTheDocument();
    expect(screen.getByText("記事タイトル2")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "記事一覧をすべて見る →" }),
    ).toHaveAttribute("href", "/blog/articles");
  });

  it("カテゴリー一覧をタグフィルタとして表示する", async () => {
    mockCmsHandlers();

    render(await BlogTopPage());

    expect(screen.getByRole("link", { name: "お知らせ" })).toHaveAttribute(
      "href",
      "/blog/articles?category=news",
    );
  });

  it("記事が0件のときは案内文を表示する", async () => {
    server.use(
      http.get("https://dummy.microcms.io/api/v1/articles", () =>
        HttpResponse.json({
          contents: [],
          totalCount: 0,
          offset: 0,
          limit: 7,
        }),
      ),
      http.get("https://dummy.microcms.io/api/v1/categories", () =>
        HttpResponse.json({
          contents: mockCategories,
          totalCount: mockCategories.length,
          offset: 0,
          limit: 100,
        }),
      ),
    );

    render(await BlogTopPage());

    expect(screen.getByText("まだ記事がありません。")).toBeInTheDocument();
  });
});
