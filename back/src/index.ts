import "dotenv/config";
import { serve } from "@hono/node-server";
import app from "./app.js";
import { logger } from "./logger/logger.js";
import { prisma } from "./prisma/client.js";

const port = Number(process.env.PORT ?? 3000);

await prisma.$connect();
logger.info("データベースに接続しました");

serve({ fetch: app.fetch, port }, (info) => {
  logger.info({ port: info.port }, "サーバーを起動しました");
});
