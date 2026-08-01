import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("GET /api", () => {
  it("Hello World!を返す", async () => {
    const res = await SELF.fetch("http://example.com/api");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });

  it("存在しないパスは404を返す", async () => {
    const res = await SELF.fetch("http://example.com/api/not-found");
    expect(res.status).toBe(404);
  });
});
