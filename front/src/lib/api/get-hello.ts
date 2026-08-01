import { apiClient, assertOk } from "./client";

export async function getHello(): Promise<string> {
  const response = await assertOk(await apiClient.api.$get());
  return response.text();
}
