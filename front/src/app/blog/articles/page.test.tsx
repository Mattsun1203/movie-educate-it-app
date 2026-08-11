import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import BlogArticlesPage from "./page";

const mockCategories = [
  { id: "frontend", name: "フロントエンド" },
  { id: "study", name: "学習法" },
];

function mockArticlesEndpoint(
  contents: unknown[],
  totalCount = contents.length,
) {
  server.use(
    http.get("https://dummy.microcms.io/api/v1/articles", () =>
      HttpResponse.json({ contents, totalCount, offset: 0, limit: 9 }),
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

const article = {
  id: "article-1",
  title: "TypeScript導入で得られる3つのメリット",
  content: "<p>本文</p>",
  category: { id: "frontend", name: "フロントエンド" },
  publishedAt: "2026-07-08T00:00:00.000Z",
  createdAt: "2026-07-08T00:00:00.000Z",
  updatedAt: "2026-07-08T00:00:00.000Z",
};

describe("BlogArticlesPage", () => {
  it("パンくず・見出し・記事一覧を表示する", async () => {
    mockArticlesEndpoint([article]);

    render(
      await BlogArticlesPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "記事一覧" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ブログ" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(
      screen.getByText("TypeScript導入で得られる3つのメリット"),
    ).toBeInTheDocument();
  });

  it("categoryを指定するとそのタグがactiveになる", async () => {
    mockArticlesEndpoint([article]);

    render(
      await BlogArticlesPage({
        searchParams: Promise.resolve({ category: "frontend" }),
      }),
    );

    expect(
      screen.getByRole("link", { name: "フロントエンド" }),
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "すべて" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("該当カテゴリーに記事が0件のとき専用メッセージを表示する", async () => {
    mockArticlesEndpoint([], 0);

    render(
      await BlogArticlesPage({
        searchParams: Promise.resolve({ category: "study" }),
      }),
    );

    expect(
      screen.getByText("「学習法」に該当する記事はまだありません。"),
    ).toBeInTheDocument();
  });

  it("記事総数に応じたページネーションを表示する", async () => {
    mockArticlesEndpoint([article], 20);

    render(
      await BlogArticlesPage({
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/blog/articles?page=3",
    );
  });
});
