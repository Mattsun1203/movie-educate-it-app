import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    globalSetup: ["./test/testcontainers-setup.ts"],
    testTimeout: 30000,
  },
});
