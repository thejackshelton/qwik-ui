import { Locator, Page } from '@playwright/test';
export type DriverLocator = Locator | Page;

export function createTestDriver<T extends DriverLocator>(rootLocator: T) {
  const getTabAt = (index: number) => {
    return rootLocator.getByRole('tab').nth(index);
  };

  const getVisiblePanel = () => {
    return rootLocator.getByRole('tabpanel');
  };

  return {
    ...rootLocator,
    locator: rootLocator,
    getTabAt,
    getVisiblePanel,
  };
}
