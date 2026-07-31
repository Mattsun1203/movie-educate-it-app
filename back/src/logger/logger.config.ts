import { randomUUID } from "node:crypto";
import { RequestMethod } from "@nestjs/common";
import type { Params } from "nestjs-pino";

const isDevelopment = (process.env.NODE_ENV ?? "development") === "development";

function defaultLevel(): string {
  if (process.env.NODE_ENV === "test") return "silent";
  if (process.env.NODE_ENV === "production") return "info";
  return "debug";
}

export const loggerConfig: Params = {
  // nestjs-pinoの既定は forRoutes: [{ path: "*", method: ALL }] だが、
  // グローバルプレフィックス（/api）と新しいpath-to-regexpの組み合わせでは
  // ちょうど /api（末尾セグメントなし）にマッチしない。"/{*splat}"も末尾に
  // 必須のスラッシュが残るため同様に/apiちょうどにはマッチしない。
  // スラッシュごとオプションにする "{/*splat}" で /api と /api/... の両方に一致させる。
  forRoutes: [{ path: "{/*splat}", method: RequestMethod.ALL }],
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? defaultLevel(),
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            singleLine: true,
            translateTime: "HH:MM:ss",
          },
        }
      : undefined,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
    ],
    genReqId: (req) => req.headers["x-request-id"] ?? randomUUID(),
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    // 認証実装後、認証ガード等でreq.userをセットすればuserIdが自動的に
    // このリクエストに紐づく全ログ（アクセスログ含む）に構造化フィールドとして付与される。
    customProps: (req) => {
      const userId = (req as { user?: { id?: string } }).user?.id;
      return userId ? { userId } : {};
    },
  },
};
