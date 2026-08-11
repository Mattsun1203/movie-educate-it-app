import { client } from "./client";
import type { Article, ArticleListParams, ArticleListResult } from "./types";

export async function getArticles({
  limit = 9,
  offset = 0,
  categoryId,
  query,
}: ArticleListParams = {}): Promise<ArticleListResult> {
  const response = await client.getList<Article>({
    endpoint: "articles",
    queries: {
      limit,
      offset,
      filters: categoryId ? `category[equals]${categoryId}` : undefined,
      q: query,
    },
  });

  return {
    articles: response.contents,
    totalCount: response.totalCount,
    offset: response.offset,
    limit: response.limit,
  };
}
