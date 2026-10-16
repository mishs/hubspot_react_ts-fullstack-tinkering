import { test, expect, devices, type Page } from "@playwright/test";

// The directory's one request; failures are simulated only by intercepting it in this browser.
const USERS = /jsonplaceholder\.typicode\.com\/users$/;
const unavailable = {
  status: 503,
  contentType: "application/json",
  body: '{"error":"Service Unavailable"}',
};

/** Counts directory requests and full-page navigations, so "recovered in place" can be checked. */
function watch(page: Page) {
  const seen = { requests: 0, navigations: 0 };
  page.on("request", (r) => {
    if (USERS.test(r.url())) seen.requests += 1;
  });
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) seen.navigations += 1;
  });
  return seen;
}
const cards = (page: Page) => page.getByRole("listitem");
const retry = (page: Page) => page.getByTestId("load-retry");

test("loads the directory from the real API", async ({ page }) => {
  await page.goto("/");
  await expect(cards(page)).toHaveCount(10);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("recovers in place after a temporary failure: no page reload, same search", async ({
  page,
}) => {
  const seen = watch(page);
  await page.route(USERS, (route) => route.fulfill(unavailable));
  await page.goto("/");
  await expect(page.getByTestId("load-error")).toContainText("We couldn’t load the directory");
  await expect(page.getByText("Try adjusting your search criteria")).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search users" }).fill("Leanne");

  await page.unroute(USERS); // service restored; the real API answers from here on
  await retry(page).click();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).first()).toContainText("Leanne Graham");
  await expect(page.getByRole("searchbox", { name: "Search users" })).toHaveValue("Leanne");
  await expect(page.getByTestId("load-error")).toHaveCount(0);
  expect(seen.requests).toBe(2);
  expect(seen.navigations).toBe(1); // the initial load only
});

test("a retry that fails again says so, and a later retry recovers", async ({ page }) => {
  await page.route(USERS, (route) => route.fulfill(unavailable));
  await page.goto("/");
  await retry(page).click();
  await expect(page.getByTestId("load-error")).toContainText("Still couldn’t load the directory");
  await expect(cards(page)).toHaveCount(0);
  await page.unroute(USERS);
  await retry(page).click();
  await expect(cards(page)).toHaveCount(10);
});

test("shows the pending retry honestly", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((r) => (release = r));
  let calls = 0;
  await page.route(USERS, async (route) => {
    calls += 1;
    if (calls === 1) return route.fulfill(unavailable);
    await held;
    return route.continue();
  });
  await page.goto("/");
  await retry(page).click();
  await expect(retry(page)).toHaveText("Retrying…");
  await expect(retry(page)).toHaveAttribute("aria-busy", "true");
  await expect(page.getByLabel("Loading users")).toBeVisible();
  release();
  await expect(cards(page)).toHaveCount(10);
});

test("Retry works with the keyboard alone and focus lands on the results", async ({
  page,
  browserName,
}) => {
  // Safari on macOS skips buttons on Tab by default; its keyboard users press Option+Tab.
  const next = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.route(USERS, (route) => route.fulfill(unavailable));
  await page.goto("/");
  await expect(retry(page)).toBeVisible();
  await page.unroute(USERS);
  for (let i = 0; i < 10; i++) {
    if (await retry(page).evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press(next);
  }
  await expect(retry(page)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(cards(page)).toHaveCount(10);
  await expect(page.getByTestId("directory-results")).toBeFocused();
});

test.describe("emulated phone", () => {
  // iPhone 13 viewport, touch and mobile emulation, in whichever browser project runs.
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices["iPhone 13"];
  test.use({ viewport, userAgent, deviceScaleFactor, isMobile, hasTouch });

  test("Retry is readable and tappable at phone width, without sideways scrolling", async ({
    page,
  }) => {
    await page.route(USERS, (route) => route.fulfill(unavailable));
    await page.goto("/");
    await expect(page.getByTestId("load-error")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const box = await retry(page).boundingBox();
    expect(box && box.height).toBeGreaterThanOrEqual(44);
    await page.unroute(USERS);
    await retry(page).tap();
    await expect(cards(page)).toHaveCount(10);
  });
});
