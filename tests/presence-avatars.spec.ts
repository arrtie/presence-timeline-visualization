/** @format */

import { test, expect, type Page, type Locator } from "@playwright/test";

// TODO: test for multiple profiles

test.describe("when the profile data is loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      "*/**/api/profiles",
      async (route) => new Promise(() => {})
    );
  });

  test("should find loader", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("loader")).toBeVisible();
  });
});

test.describe("when there is a network error fetching the profile data", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/profiles", async (route) => {
      await route.abort();
    });
  });

  test("should find the missing presence data warning", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("missing-presence-data")).toHaveText(
      "Presence data is missing :("
    );
  });
});

test.describe("when the profile data is empty", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/profiles", async (route) => {
      const json = null;
      await route.fulfill({ json });
    });
  });

  test("should find the missing presence data warning", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("missing-presence-data")).toHaveText(
      "Presence data is missing :("
    );
  });
});

test.describe("when there is profile data", () => {
  test.describe("and there is only one profile", () => {
    test.describe("and it has an avatar", () => {
      const singleProfileWithAvatar = {
        uid: 85974,
        created_at: 1737144759000,
        name: "Untrusted",
        photo_url:
          "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        category: null,
      };

      test.beforeEach(async ({ page }) => {
        await page.route("*/**/api/profiles", async (route) => {
          const json = [singleProfileWithAvatar];
          await route.fulfill({ json });
        });
      });

      test("should find that profile's avatar", async ({ page }) => {
        await page.goto("/");
        expect(page.getByAltText(singleProfileWithAvatar.name)).toHaveAttribute(
          "src",
          singleProfileWithAvatar.photo_url
        );
      });
    });

    test.describe("and it has no avatar", () => {
      const singleProfileWithAvatar = {
        uid: 86011,
        created_at: 1737574261000,
        name: "S23ultra",
        photo_url: null,
        category: "family",
      };

      test.beforeEach(async ({ page }) => {
        await page.route("*/**/api/profiles", async (route) => {
          const json = [singleProfileWithAvatar];
          await route.fulfill({ json });
        });
      });

      test("should find that profile's letter icon", async ({ page }) => {
        await page.goto("/");
        expect(page.getByLabel(singleProfileWithAvatar.name)).toHaveText("S");
      });
    });
  });
});
