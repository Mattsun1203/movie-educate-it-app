import { Hono } from "hono";
import { errorHandler } from "./common/error-handler.js";
import { type LoggerVariables, loggerMiddleware } from "./logger/middleware.js";

export type Bindings = {
  HYPERDRIVE: Hyperdrive;
};

const app = new Hono<{
  Bindings: Bindings;
  Variables: LoggerVariables;
}>().basePath("/api");

app.use("*", loggerMiddleware);
app.onError(errorHandler);

// Hono RPCの型推論はチェーンされた式でないと正しく蓄積されない。
// ルートを追加する際も分割せず、必ずこのチェーンに繋げること。
const routes = app.get("/", (context) => context.text("Hello World!"));

export type AppType = typeof routes;
export default app;
