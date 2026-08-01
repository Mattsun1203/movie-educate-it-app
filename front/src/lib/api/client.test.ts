import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { ApiError, apiClient, assertOk } from "./client";

describe("apiClient", () => {
  it("成功時はレスポンスを返す", async () => {
    server.use(
      http.get("http://localhost:3000/api", () => HttpResponse.text("pong")),
    );

    const response = await assertOk(await apiClient.api.$get());

    await expect(response.text()).resolves.toBe("pong");
  });
});

describe("assertOk", () => {
  it("成功時はそのままresponseを返す", async () => {
    server.use(
      http.get("http://localhost:3000/api", () => HttpResponse.text("pong")),
    );

    const response = await assertOk(await apiClient.api.$get());

    expect(response.ok).toBe(true);
  });

  it("失敗ステータスのときApiErrorを投げる", async () => {
    server.use(
      http.get("http://localhost:3000/api", () =>
        HttpResponse.text("Not Found", { status: 404 }),
      ),
    );

    await expect(assertOk(await apiClient.api.$get())).rejects.toThrow(
      ApiError,
    );
  });
});
