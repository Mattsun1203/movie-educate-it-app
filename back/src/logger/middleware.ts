import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";
import type { Logger } from "pino";
import { logger } from "./logger.js";

export type LoggerVariables = {
  logger: Logger;
};

export const loggerMiddleware: MiddlewareHandler<{
  Variables: LoggerVariables;
}> = async (context, next) => {
  const reqId = context.req.header("x-request-id") ?? randomUUID();
  const requestLogger = logger.child({ reqId });
  context.set("logger", requestLogger);

  const start = Date.now();
  await next();
  const responseTime = Date.now() - start;
  const status = context.res.status;
  const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

  requestLogger[level](
    {
      req: { method: context.req.method, url: context.req.path },
      res: { statusCode: status },
      responseTime,
    },
    "request completed",
  );
};
