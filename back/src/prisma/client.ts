import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Hyperdrive経由で使う場合、PrismaClientをグローバルな単一インスタンスにすると
// 2回目以降のリクエストでハングする問題がCloudflare公式に報告されているため、
// 必ずリクエストごとにこの関数で新しいインスタンスを生成すること。
export function createPrismaClient(connectionString: string) {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}
