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

    const a11yScanResults = await new AxeBuilder({ page })
      .include('[role="tablist"]')
      .include('[role="tab"]')
      .include('[role="tabpanel"]')
      .analyze();

    expect(a11yScanResults.violations).toEqual([]);
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

  test(`GIVEN 3 tabs
        WHEN changing the selected index programmatically to the middle
        THEN render the middle panel`, async ({ page }) => {
    const { driver: d } = await setup(page, 'programmatic');

    await expect(d.getVisiblePanel()).toContainText('Maria');

    await page.getByRole('button', { name: 'change to 2nd tab' }).click();

    await expect(d.getVisiblePanel()).toContainText('Carl');
  });

  test(`GIVEN 3 tabs
        WHEN clicking the middle one
        THEN onSelectedIndexChange should be called`, async ({ page }) => {
    const { driver: d } = await setup(page, 'on-selected-index-change');

    await d.getTabAt(1).click();

    await expect(page.getByRole('paragraph').last()).toHaveText('Selected Index: 1');
  });
});
