import { Hono } from "hono";
import { type AuthVariables, authMiddleware } from "./auth/middleware.js";
import { errorHandler } from "./common/error-handler.js";
import { type LoggerVariables, loggerMiddleware } from "./logger/middleware.js";

export type Bindings = {
  HYPERDRIVE: Hyperdrive;
  // authアプリ（apps/auth/api）が発行するRS256署名のaccess tokenを検証するための公開鍵（PEMをbase64エンコードしたもの）。
  JWT_PUBLIC_KEY_BASE64: string;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: LoggerVariables & AuthVariables;
}>().basePath("/api");

app.use("*", loggerMiddleware);
app.use("*", authMiddleware);
app.onError(errorHandler);

// Hono RPCの型推論はチェーンされた式でないと正しく蓄積されない。
// ルートを追加する際も分割せず、必ずこのチェーンに繋げること。
const routes = app.get("/", (context) => context.text("Hello World!"));

export type AppType = typeof routes;
export default app;
