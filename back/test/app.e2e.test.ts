import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import { prisma } from "../src/prisma/client.js";

describe("GET /api (e2e)", () => {
  it("Hello World!を返す", async () => {
    const res = await app.request("/api");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });

  it("実際のDBに接続できる", async () => {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    expect(result).toEqual([{ ok: 1 }]);
  });
});
