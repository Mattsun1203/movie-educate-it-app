import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

// wrangler.jsoncのhyperdriveバインディングは、wrangler devと同じ仕組みで
// CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE環境変数から
// ローカル接続文字列を解決する。テスト実行時はNeonのテスト用ブランチの
// 接続文字列をこの環境変数に設定すること。
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
    }),
  ],
});
