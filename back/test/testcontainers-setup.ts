import { execSync } from "node:child_process";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export default async function setup() {
  const container = await new PostgreSqlContainer("postgres:17-alpine").start();

  process.env.DATABASE_URL = container.getConnectionUri();

  execSync("pnpm exec prisma migrate deploy", {
    cwd: `${import.meta.dirname}/..`,
    env: process.env,
    stdio: "inherit",
  });

  return async () => {
    await container.stop();
  };
}
