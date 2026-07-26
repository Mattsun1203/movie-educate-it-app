import { execSync } from "node:child_process";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { containerState } from "./postgres-container";

export default async function globalSetup() {
  const container = await new PostgreSqlContainer("postgres:17-alpine").start();
  containerState.container = container;

  process.env.DATABASE_URL = container.getConnectionUri();

  execSync("pnpm exec prisma migrate deploy", {
    cwd: `${__dirname}/../..`,
    env: process.env,
    stdio: "inherit",
  });
}
