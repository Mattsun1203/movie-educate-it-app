import pino from "pino";

const isDevelopment = (process.env.NODE_ENV ?? "development") === "development";

function defaultLevel(): string {
  if (process.env.NODE_ENV === "test") return "silent";
  if (process.env.NODE_ENV === "production") return "info";
  return "debug";
}

export const logger = pino({
  level: process.env.LOG_LEVEL || defaultLevel(),
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
});
