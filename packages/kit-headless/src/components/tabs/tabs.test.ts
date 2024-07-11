import { expect, test, type Page } from '@playwright/test';
import { createTestDriver } from './tabs.driver';
import AxeBuilder from '@axe-core/playwright';

async function setup(page: Page, exampleName: string) {
  await page.goto(`headless/tabs/${exampleName}`);

  const driver = createTestDriver(page);

  return {
    driver,
  };
}

test.describe('A11y', () => {
  test('Axe Validation Test', async ({ page }) => {
    await setup(page, 'hero');

    const initialResults = await new AxeBuilder({ page })
      .include('[role="combobox"]')
      .analyze();

    expect(initialResults.violations).toEqual([]);
  });
});

test.describe('Critical functionality', () => {
  test(`GIVEN 3 tabs
        WHEN clicking the middle one
        THEN render the middle panel`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.getTabAt(1).click();

    await expect(d.getVisiblePanel()).toContainText('Carl');
  });
});
