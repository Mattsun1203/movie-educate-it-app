import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getHello } from "./get-hello";

describe("getHello", () => {
  it("バックエンドのGET /apiを呼び出し、レスポンス文字列を返す", async () => {
    server.use(
      http.get("http://localhost:3000/api", () =>
        HttpResponse.text("Hello World!"),
      ),
    );

    await expect(getHello()).resolves.toBe("Hello World!");
  });
});
