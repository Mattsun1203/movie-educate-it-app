import pino from "pino";

function defaultLevel(): string {
  if (process.env.NODE_ENV === "test") return "silent";
  if (process.env.NODE_ENV === "production") return "info";
  return "debug";
}

// Cloudflare Workersのランタイム（workerd）はNode.jsのworker_threadsに
// 依存するpinoのtransport機能（pino-prettyなど）をサポートしないため、
// browserモード（console.logへの書き込みに差し替える設定）を使う。
// ローカルで整形して見たい場合は `pnpm dev | pino-pretty` のようにパイプする。
export const logger = pino({
  level: process.env.LOG_LEVEL || defaultLevel(),
  browser: {
    asObject: true,
    write: (o) => console.log(JSON.stringify(o)),
  },
});
