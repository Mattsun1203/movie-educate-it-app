import type { AppType } from "back";
import { hc } from "hono/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = hc<AppType>(API_BASE_URL);

export async function assertOk<
  T extends { ok: boolean; status: number; statusText: string },
>(response: T): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `APIリクエストに失敗しました: ${response.status} ${response.statusText}`,
    );
  }

  return response;
}
