import { client } from "./client";
import type { Category } from "./types";

export async function getCategories(): Promise<Category[]> {
  const response = await client.getList<Category>({
    endpoint: "categories",
    queries: { limit: 100 },
  });

  return response.contents;
}
