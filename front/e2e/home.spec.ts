import { test, expect } from "@playwright/test";

test("トップページが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "To get started, edit the page.tsx file.",
    }),
  ).toBeVisible();
});
