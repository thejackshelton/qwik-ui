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

  test(`GIVEN a tab with a custom onClick$ handler
        WHEN tab is clicked on
        THEN the handler should be called`, async ({ page }) => {
    const { driver: d } = await setup(page, 'on-click');

    await expect(d.getVisiblePanel()).toContainText('Custom onClick was called: false');

    await d.getTabAt(0).click();

    await expect(d.getVisiblePanel()).toContainText('Custom onClick was called: true');
  });

  test(`GIVEN 4 tabs,
        WHEN removing the last one dynamically
        THEN only 3 should remain`, async ({ page }) => {
    await setup(page, 'dynamic');

    await expect(page.getByRole('tab')).toHaveCount(4);

    await page.getByRole('button', { name: 'Remove Tab' }).click();

    await expect(page.getByRole('tab')).toHaveCount(3);
  });

  test(`GIVEN 3 tabs,
        WHEN selecting 3rd
        AND removing 1st dynamically
        AND clicking 2nd (now 1st)
        THEN the correct tab should be displayed`, async ({ page }) => {
    const { driver: d } = await setup(page, 'dynamic');

    await d.getTabAt(2).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 3 Panel');

    await page.getByRole('textbox', { name: 'Index to remove:' }).fill('0');

    await page.getByRole('button', { name: 'Remove Tab' }).click();

    await d.getTabAt(0).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 2 Panel');
  });

  test(`GIVEN 4 tabs
        WHEN clicking on the last one and then removing it
        THEN tab 3 should be shown`, async ({ page }) => {
    const { driver: d } = await setup(page, 'dynamic');

    await d.getTabAt(3).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 4 Panel');

    await page.getByRole('textbox', { name: 'Index to remove:' }).fill('3');

    await page.getByRole('button', { name: 'Remove Tab' }).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 3 Panel');
  });

  test(`GIVEN 4 tabs
        WHEN clicking on the last one and then removing the 3rd
        THEN tab 4 should be shown`, async ({ page }) => {
    const { driver: d } = await setup(page, 'dynamic');

    await d.getTabAt(3).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 4 Panel');

    await page.getByRole('textbox', { name: 'Index to remove:' }).fill('2');

    await page.getByRole('button', { name: 'Remove Tab' }).click();

    await expect(d.getVisiblePanel()).toContainText('Dynamic Tab 4 Panel');
  });

  test(`GIVEN 4 tabs
        WHEN selecting the 3rd one and adding a tab at the second one
        THEN the correct tab should be displayed`, async ({ page }) => {
    page;
    // TODO: maybe copy spec test from cypress?
  });
});
