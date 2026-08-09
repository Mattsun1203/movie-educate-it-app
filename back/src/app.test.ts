import { env, SELF } from "cloudflare:test";
import { SignJWT, exportSPKI, generateKeyPair } from "jose";
import { beforeAll, describe, expect, it } from "vitest";
import type { Bindings } from "./app.js";

describe("GET /api", () => {
  let validToken: string;

  beforeAll(async () => {
    const { publicKey, privateKey } = await generateKeyPair("RS256");
    (env as Bindings).JWT_PUBLIC_KEY_BASE64 = btoa(await exportSPKI(publicKey));

    validToken = await new SignJWT({ email: "test@example.com" })
      .setProtectedHeader({ alg: "RS256" })
      .setSubject("test-user-id")
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(privateKey);
  });

  it("Authorizationヘッダーがない場合は401を返す", async () => {
    const res = await SELF.fetch("http://example.com/api");
    expect(res.status).toBe(401);
  });

  it("access tokenが不正な場合は401を返す", async () => {
    const res = await SELF.fetch("http://example.com/api", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect(res.status).toBe(401);
  });

  it("有効なaccess tokenがあればHello World!を返す", async () => {
    const res = await SELF.fetch("http://example.com/api", {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });

  it("認証済みでも存在しないパスは404を返す", async () => {
    const res = await SELF.fetch("http://example.com/api/not-found", {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    expect(res.status).toBe(404);
  });
});
