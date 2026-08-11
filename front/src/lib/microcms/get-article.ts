import { client } from "./client";
import type { Article } from "./types";

export async function getArticle(id: string): Promise<Article | null> {
  try {
    return await client.getListDetail<Article>({
      endpoint: "articles",
      contentId: id,
    });
  } catch {
    return null;
  }
}
