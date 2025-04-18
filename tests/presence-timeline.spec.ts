/** @format */

import { test, expect, type Page, type Locator } from "@playwright/test";

// TODO: test for the failure of GET /profiles
// TODO: test for profile avatars

function getPresenceBubble(identifier: string) {
  return (page: Page) => page.getByLabel(identifier);
}

async function getPresenceBubbleY(bubble: Locator) {
  return (await bubble.boundingBox())?.y;
}

test.describe("when the presence data is loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      "*/**/api/presence",
      async (route) => new Promise(() => {})
    );
  });

  test("should find loader", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("loader")).toBeVisible();
  });
});

test.describe("when there is a network error fetching the presence data", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/presence", async (route) => {
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

test.describe("when the presence data is empty", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("*/**/api/presence", async (route) => {
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

test.describe("when there is presence data", () => {
  test.describe("and there is only one profile", () => {
    function generatePresenceIntervals(
      duration: number,
      gap: number,
      count: number
    ) {
      const now = Date.now();

      return Array(count)
        .fill(null)
        .map((_, index) => {
          const current = now - (duration + gap) * index;
          return [current - duration, current];
        })
        .reverse();
    }

    const presence_intervals = generatePresenceIntervals(
      1000 * 60 * 60 * 2, // Two hours
      1000 * 60 * 60 * 1, // One hour
      4
    );

    const singleUserWithMultiplePresence = {
      "85956": {
        presence_intervals: presence_intervals,
        current_status: "present",
      },
    };

    test.beforeEach(async ({ page }) => {
      await page.route("*/**/api/presence", async (route) => {
        const json = singleUserWithMultiplePresence;
        await route.fulfill({ json });
      });
    });

    test("should find that profile's presence entries and exits in order down the Y axis", async ({
      page,
    }) => {
      await page.goto("/");

      for (const presenceData of Object.values(
        singleUserWithMultiplePresence
      )) {
        let lastYIndex = 0;

        for (const presenceInterval of presenceData.presence_intervals) {
          const [enter, exit] = presenceInterval;
          const enterBubble = getPresenceBubble(enter.toString())(page);
          await expect(enterBubble).toBeVisible();
          const exitBubble = getPresenceBubble(exit.toString())(page);
          await expect(exitBubble).toBeVisible();

          const enterBubbleY = await getPresenceBubbleY(enterBubble);
          const exitBubbleY = await getPresenceBubbleY(exitBubble);

          if (enterBubbleY == null || exitBubbleY == null) {
            throw new Error("could not find a y index of a presence bubble");
          }

          expect(exitBubbleY).toBeGreaterThan(enterBubbleY);
          expect(exitBubbleY).toBeGreaterThan(lastYIndex);
          lastYIndex = exitBubbleY;
        }
      }
    });
  });
});
