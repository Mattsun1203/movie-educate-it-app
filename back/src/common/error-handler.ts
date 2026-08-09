import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Bindings } from "../app.js";
import type { AuthVariables } from "../auth/middleware.js";
import type { LoggerVariables } from "../logger/middleware.js";

export const errorHandler: ErrorHandler<{
  Bindings: Bindings;
  Variables: LoggerVariables & AuthVariables;
}> = (err, context) => {
  const status = err instanceof HTTPException ? err.status : 500;
  const level = status >= 500 ? "error" : "warn";

  // エラーは発生箇所ごとに個別ログを残さず、ここに一本化して1エラー1ログとする。
  context.get("logger")[level](
    {
      err,
      statusCode: status,
      errorType: err.constructor.name,
    },
    "リクエスト処理中にエラーが発生しました",
  );

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return context.json({ message: "Internal server error" }, 500);
};
