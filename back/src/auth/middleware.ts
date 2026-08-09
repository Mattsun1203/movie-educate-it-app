import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Bindings } from "../app.js";
import type { LoggerVariables } from "../logger/middleware.js";
import { verifyAccessToken } from "./token-verifier.js";

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthVariables = {
  user: AuthUser;
};

function extractBearerToken(
  authorizationHeader: string | undefined,
): string | null {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  return authorizationHeader.slice(7);
}

export const authMiddleware: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: LoggerVariables & AuthVariables;
}> = async (context, next) => {
  const token = extractBearerToken(context.req.header("Authorization"));
  if (!token) throw new HTTPException(401, { message: "認証が必要です" });

  let payload: Awaited<ReturnType<typeof verifyAccessToken>>;
  try {
    payload = await verifyAccessToken(token, context.env.JWT_PUBLIC_KEY_BASE64);
  } catch {
    throw new HTTPException(401, { message: "Invalid or expired token" });
  }

  context.set("user", { id: payload.sub, email: payload.email });
  context.set("logger", context.get("logger").child({ userId: payload.sub }));

  await next();
};
