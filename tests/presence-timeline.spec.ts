import { test, expect, type Page, type Locator } from '@playwright/test';

// TODO: test for the failure of GET /profiles
// TODO: test for profile avatars

function getPresenceBubble(identifier: string) {
  return (page: Page) => page.getByLabel(identifier);
}

async function getPresenceBubbleY(bubble: Locator) {
  return (await bubble.boundingBox())?.y
}

test.describe('when the presence data is loading', () => {
  test.beforeEach(async ({page}) => {
    await page.route('*/**/api/presence', async route => new Promise(()=> {}));
  })

  test('should find loader', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId("loader")).toBeVisible();
  });
});

test.describe('when there is a network error fetching the presence data', () => {
  test.beforeEach(async ({page}) => {
    await page.route('*/**/api/presence', async route => {
      await route.abort();
    });
  })

  test('should find the missing presence data warning', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId("missing-presence-data")).toHaveText("Presence data is missing :(");
  })
});

test.describe('when the presence data is empty', () => {
  test.beforeEach(async ({page}) => {
    await page.route('*/**/api/presence', async route => {
      const json = null;
      await route.fulfill({ json });
    });
  })

  test('should find the missing presence data warning', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId("missing-presence-data")).toHaveText("Presence data is missing :(");
  })
});

test.describe('when there is presence data', () => {
  test.describe('and there is only one profile', () => {
    const singleUserWithMultiplePresence = {
      "85956": {
          "presence_intervals": [
              [
                  1737053092803,
                  1737067430558
              ],
              [
                  1737067748658,
                  1737069047321
              ],
              [
                  1737558910173,
                  1737571706016
              ],
              [
                  1737573027870,
                  1737581786422
              ],
              [
                  1737673603498,
                  1737698399999
              ]
          ],
          "current_status": "present"
      }
    }
    
    test.beforeEach(async ({page}) => {
      await page.route('*/**/api/presence', async route => {
        const json = JSON.stringify(singleUserWithMultiplePresence);
        await route.fulfill({ json });
      });
    })
    
    test('should find that profile\'s presence entries and exits in order down the Y axis', async ({ page }) => {
      await page.goto('/');
      for(const [profile, presenceData] of Object.entries(singleUserWithMultiplePresence)) {
        let lastYIndex = 0;
        presenceData.presence_intervals.forEach(async (presenceInterval) => {
          const [enter, exit] = presenceInterval;
          const enterBubble = getPresenceBubble(enter.toString())(page);
          expect(enterBubble).toBeVisible();
          const exitBubble = getPresenceBubble(exit.toString())(page);
          expect(exitBubble).toBeVisible();

          const enterBubbleY = await  getPresenceBubbleY(enterBubble);
          const exitBubbleY =  await getPresenceBubbleY(exitBubble);
          
          if(enterBubbleY == null || exitBubbleY == null) {
            throw new Error("could not find a y index of a presence bubble")
          }
          expect(exitBubbleY).toBeGreaterThan(enterBubbleY);
          expect(exitBubbleY).toBeGreaterThan(lastYIndex);
          lastYIndex = exitBubbleY;
        })
      }
    })
  });
});