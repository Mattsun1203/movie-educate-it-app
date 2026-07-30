import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { ApiError, apiClient } from "./client";

describe("apiClient", () => {
  it("成功時はResponseを返す", async () => {
    server.use(
      http.get("http://localhost:3000/api/ping", () =>
        HttpResponse.text("pong"),
      ),
    );

    const response = await apiClient.get("/ping");

    await expect(response.text()).resolves.toBe("pong");
  });

  it("失敗ステータスのときApiErrorを投げる", async () => {
    server.use(
      http.get("http://localhost:3000/api/ping", () =>
        HttpResponse.text("Not Found", { status: 404 }),
      ),
    );

    await expect(apiClient.get("/ping")).rejects.toThrow(ApiError);
  });

  it("getはGETメソッドでリクエストする", async () => {
    server.use(
      http.get("http://localhost:3000/api/courses", ({ request }) => {
        expect(request.method).toBe("GET");
        return HttpResponse.json({ ok: true });
      }),
    );

    const response = await apiClient.get("/courses");

    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("postはbodyをJSONとして送信する", async () => {
    server.use(
      http.post("http://localhost:3000/api/courses", async ({ request }) => {
        expect(request.headers.get("Content-Type")).toBe("application/json");
        await expect(request.json()).resolves.toEqual({ title: "React入門" });
        return HttpResponse.json({ id: "1" }, { status: 201 });
      }),
    );

    const response = await apiClient.post("/courses", { title: "React入門" });

    await expect(response.json()).resolves.toEqual({ id: "1" });
  });

  it("putはPUTメソッドでbodyを送信する", async () => {
    server.use(
      http.put("http://localhost:3000/api/courses/1", async ({ request }) => {
        expect(request.method).toBe("PUT");
        await expect(request.json()).resolves.toEqual({ title: "更新後" });
        return HttpResponse.json({ id: "1" });
      }),
    );

    await apiClient.put("/courses/1", { title: "更新後" });
  });

  it("patchはPATCHメソッドでbodyを送信する", async () => {
    server.use(
      http.patch("http://localhost:3000/api/courses/1", async ({ request }) => {
        expect(request.method).toBe("PATCH");
        await expect(request.json()).resolves.toEqual({ isFree: true });
        return HttpResponse.json({ id: "1" });
      }),
    );

    await apiClient.patch("/courses/1", { isFree: true });
  });

  it("deleteはDELETEメソッドでリクエストする", async () => {
    server.use(
      http.delete("http://localhost:3000/api/courses/1", ({ request }) => {
        expect(request.method).toBe("DELETE");
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await apiClient.delete("/courses/1");
  });
});
