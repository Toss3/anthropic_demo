import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("page loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Claude in the Loop");
  });

  test("hero section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("barrier to building");
  });

  test("demo mode indicator visible", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Demo mode — using canned outputs")
    ).toBeVisible();
  });

  test("all hero story sections exist", async ({ page }) => {
    await page.goto("/");
    for (const id of [
      "story-claudemd",
      "story-testing",
      "story-mcp",
      "story-legacy",
    ]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("all trace frames exist", async ({ page }) => {
    await page.goto("/");
    for (const id of [
      "story-claudemd-trace",
      "story-testing-trace",
      "story-mcp-trace",
      "story-legacy-trace",
    ]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("vignettes section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#vignettes")).toBeAttached();
    await expect(
      page.getByRole("heading", { name: "Vignettes" })
    ).toBeAttached();
  });

  test("perspectives section renders with tabs", async ({ page }) => {
    await page.goto("/");
    const perspectives = page.locator("#perspectives");
    await expect(perspectives).toBeAttached();
    await expect(
      perspectives.getByRole("button", { name: "Developer" })
    ).toBeAttached();
    await expect(
      perspectives.getByRole("button", { name: "Eng. Manager" })
    ).toBeAttached();
    await expect(
      perspectives.getByRole("button", { name: "Exec & Security" })
    ).toBeAttached();
  });

  test("closing section renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#closing")).toBeAttached();
    await expect(
      page.getByText("Built with Claude Code")
    ).toBeAttached();
  });

  test("scroll through all sections without errors", async ({ page }) => {
    await page.goto("/");

    const sections = [
      "#story-claudemd",
      "#story-claudemd-trace",
      "#story-testing",
      "#story-mcp",
      "#story-legacy",
      "#vignettes",
      "#perspectives",
      "#closing",
    ];

    for (const selector of sections) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }

    // Check no JS errors by verifying page still works
    await expect(page.locator("#closing")).toBeVisible();
  });

  test("no horizontal page overflow", async ({ page }) => {
    await page.goto("/");
    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });
});
