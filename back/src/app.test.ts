import { describe, expect, it } from "vitest";
import app from "./app.js";

describe("GET /api", () => {
  it("Hello World!を返す", async () => {
    const res = await app.request("/api");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });

  it("存在しないパスは404を返す", async () => {
    const res = await app.request("/api/not-found");
    expect(res.status).toBe(404);
  });
});
