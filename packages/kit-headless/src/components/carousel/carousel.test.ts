import { test, type Page, expect } from '@playwright/test';
import { createTestDriver } from './driver';
import { AxeBuilder } from '@axe-core/playwright';

async function setup(page: Page, exampleName: string) {
  await page.goto(`headless/carousel/${exampleName}`);

  const driver = createTestDriver(page);

  return {
    driver,
  };
}

test.describe('Mouse Behavior', () => {
  test(`GIVEN a carousel
        WHEN clicking on the next button
        THEN it should move to the next slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.getNextButton().click();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel
        WHEN clicking on the previous button
        THEN it should move to the previous slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    // initial setup
    await d.getNextButton().click();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    // testing clicking the "previous" button
    await d.getPrevButton().click();
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN using a pointer device and dragging to the left
        THEN it should move to the next slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    // Ensure the first slide is active
    const firstSlide = d.getSlideAt(0);
    await expect(firstSlide).toHaveAttribute('data-active');

    // grab first slide dimensions
    const boundingBox = await d.getSlideBoundingBoxAt(0);

    const startX = boundingBox.x + boundingBox.width * 0.8; // near right edge
    const endX = boundingBox.x + boundingBox.width * 0.2; // near left edge
    const y = boundingBox.y + boundingBox.height / 2; // swipe height

    // perform the drag action
    await firstSlide.hover({ position: { x: 5, y: 5 } });
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();

    // second slide should be active
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with dragging enabled
    WHEN using a pointer device and dragging to the right
    THEN it should move to the previous slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    // initial setup
    await d.getNextButton().click();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    const boundingBox = await d.getSlideBoundingBoxAt(1);

    const endX = boundingBox.x + boundingBox.width * 0.9; // End closer to the right edge
    const y = 5;

    // dragging
    const slide = d.getSlideAt(1);
    await slide.hover({ position: { x: 5, y: 5 } });
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 5 });
    await page.mouse.up();

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN clicking on the pagination bullets
        THEN it should move to the corresponding slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    await d.getPaginationBullet(6).click();
    await expect(d.getSlideAt(6)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(2)).not.toHaveAttribute('data-active');

    await d.getPaginationBullet(1).click();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(6)).not.toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with dragging enabled
    WHEN dragging the carousel
    THEN it should affect the slide position`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    const initialSlideBox = await d.getSlideBoundingBoxAt(0);
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');

    const startX = initialSlideBox.x + initialSlideBox.width * 0.8;
    const endX = initialSlideBox.x + initialSlideBox.width * 0.2;
    const y = initialSlideBox.y + initialSlideBox.height / 2;

    await d.getSlideAt(0).hover({ position: { x: 5, y: 5 } });
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();

    const finalSlideBox = await d.getSlideBoundingBoxAt(0);
    expect(Math.abs(finalSlideBox.x - initialSlideBox.x)).toBeGreaterThan(1);
  });

  test(`GIVEN a carousel with dragging disabled
        WHEN attempting to drag the carousel
        THEN it should not affect the slide position`, async ({ page }) => {
    const { driver: d } = await setup(page, 'non-draggable');

    const initialSlideBox = await d.getSlideBoundingBoxAt(0);
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');

    const startX = initialSlideBox.x + initialSlideBox.width * 0.8;
    const endX = initialSlideBox.x + initialSlideBox.width * 0.2;
    const y = initialSlideBox.y + initialSlideBox.height / 2;

    await d.getSlideAt(0).hover({ position: { x: 5, y: 5 } });
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();

    const finalSlideBox = await d.getSlideBoundingBoxAt(0);
    expect(finalSlideBox.x).toBeCloseTo(initialSlideBox.x, 0);
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN dragging to the next slide
        THEN the next slide should snap to the left side of the scroller`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    const initialSlideBox = await d.getSlideBoundingBoxAt(0);
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');

    const startX = initialSlideBox.x + initialSlideBox.width * 0.8;
    const endX = initialSlideBox.x + initialSlideBox.width * 0.2;
    const y = initialSlideBox.y + initialSlideBox.height / 2;

    await d.getSlideAt(0).hover({ position: { x: 5, y: 5 } });
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y, { steps: 10 });
    await page.mouse.up();
    await d.getSlideAt(1).hover({ position: { x: 5, y: 5 } });

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    const scrollerBox = await d.getScrollerBoundingBox();
    const secondSlideBox = await d.getSlideBoundingBoxAt(1);

    // we need to check the space between the scroller left and the second slide left
    expect(Math.abs(secondSlideBox.x - scrollerBox.x)).toBeLessThan(1);
  });

  test(`GIVEN a carousel
        WHEN clicking the next button
        THEN the next slide should snap to the left side of the scroller`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getNextButton().click();

    const scrollerBox = await d.getScrollerBoundingBox();
    const secondSlideBox = await d.getSlideBoundingBoxAt(1);

    const gap = await page.evaluate(() => {
      const scroller = document.querySelector('[data-qui-carousel-scroller]');
      return parseInt(window.getComputedStyle(scroller!).getPropertyValue('gap'));
    });

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    const slideWidth = secondSlideBox.width;

    // we need to check the distance travelled to the next slide
    await expect(Math.abs(secondSlideBox.x - scrollerBox.x) - gap).toBeCloseTo(
      slideWidth,
      0,
    );
  });
});

test.describe('Keyboard Behavior', () => {
  test(`GIVEN a carousel
        WHEN the enter key is pressed on the focused next button
        THEN it should move to the next slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    await d.getNextButton().focus();
    await d.getNextButton().press('Enter');

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    await d.getNextButton().focus();
    await d.getNextButton().press('Enter');

    await expect(d.getSlideAt(2)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel
        WHEN the enter key is pressed on the focused previous button
        THEN it should move to the previous slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    await expect(d.getPrevButton()).toBeDisabled();
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');

    await d.getPaginationBullet(6).click();
    await expect(d.getSlideAt(6)).toHaveAttribute('data-active');

    await d.getPrevButton().press('Enter');
    await expect(d.getSlideAt(5)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN the first bullet is focused and the right arrow key is pressed
        THEN focus should move to the next bullet`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    // Focus the first pagination bullet
    const firstBullet = await d.getPaginationBullet(0);
    await d.getPaginationBullet(0).focus();

    await expect(firstBullet).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');

    await expect(d.getPaginationBullet(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN the 2nd bullet is focused and the left arrow key is pressed
        THEN focus should move to the previous bullet`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');
    const secondBullet = d.getPaginationBullet(1);
    await secondBullet.focus();

    await expect(secondBullet).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowLeft');

    await expect(d.getPaginationBullet(0)).toHaveAttribute('aria-selected', 'true');
  });

  test(`GIVEN a carousel with a pagination control
    WHEN the first bullet is focused and the right arrow key is pressed
    THEN focus should move to the 2nd slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    // Focus on the first pagination bullet
    const firstBullet = d.getPaginationBullet(0);
    await firstBullet.focus();

    await page.keyboard.press('ArrowRight');
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
    WHEN the 2nd bullet is focused and the left arrow key is pressed
    THEN focus should move to the 1st slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    // initial
    const secondBullet = d.getPaginationBullet(1);
    await secondBullet.focus();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    await page.keyboard.press('ArrowLeft');
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN the 1st bullet is focused and the END key is pressed
        THEN it should move to the last slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    await d.getPaginationBullet(0).focus();

    await page.keyboard.press('End');
    const totalSlides = await d.getTotalSlides();
    await expect(d.getSlideAt(totalSlides - 1)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN the last bullet is focused and the HOME key is pressed
        THEN it should move to the first slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');
    const totalSlides = await d.getTotalSlides();
    const lastBullet = d.getPaginationBullet(totalSlides - 1);
    await lastBullet.focus();
    await expect(lastBullet).toHaveAttribute('aria-selected', 'true');

    await page.keyboard.press('Home');
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });
});

// PW doesn't support swipe actions, which is why we use mouse events in-between taps
test.describe('Mobile / Touch Behavior', () => {
  test.use({ viewport: { width: 414, height: 896 }, isMobile: true, hasTouch: true });

  test(`GIVEN a mobile carousel
        WHEN it is rendered
        THEN it should use CSS scroll snap for swiping`, async ({ page }) => {
    await setup(page, 'hero');

    // is css scroll snapping enabled
    const isCoarsePointer = await page.evaluate(
      () => matchMedia('(pointer: coarse)').matches,
    );
    expect(isCoarsePointer).toBe(true);
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN swiping to the left
        THEN it should move to the next slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    const boundingBox = await d.getSlideBoundingBoxAt(0);

    const startX = boundingBox.x + boundingBox.width * 0.8; // near right edge
    const endX = boundingBox.x + boundingBox.width * 0.2; // near left edge
    const y = boundingBox.y + boundingBox.height / 2; // swipe height

    // perform the swipe action
    await page.touchscreen.tap(startX, y);
    await page.mouse.move(startX, y, { steps: 10 });
    await page.mouse.move(endX, y, { steps: 10 });
    await page.touchscreen.tap(endX, y);

    // second slide should be active
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    await expect(d.getPrevButton()).toBeEnabled();
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN swiping to the right
        THEN it should move to the previous slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    // initial setup
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getNextButton().tap();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    const boundingBox = await d.getSlideBoundingBoxAt(0);

    const startX = boundingBox.x + boundingBox.width * 0.2; // near left edge
    const endX = boundingBox.x + boundingBox.width * 0.8; // near right edge
    const y = boundingBox.y + boundingBox.height / 2; // swipe height

    await page.touchscreen.tap(startX, y);
    await page.mouse.move(startX, y, { steps: 10 });
    await page.mouse.move(endX, y, { steps: 10 });
    await page.touchscreen.tap(endX, y);

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await expect(d.getPrevButton()).toBeDisabled();
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN tapping on the next button
        THEN it should move to the next slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getNextButton().tap();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with dragging enabled
        WHEN tapping on the previous button
        THEN it should move to the previous slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getNextButton().tap();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    await d.getPrevButton().tap();
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN tapping on the pagination bullets
        THEN it should move to the corresponding slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');

    await d.getPaginationBullet(3).tap();
    await expect(d.getSlideAt(3)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(0)).not.toHaveAttribute('data-active');
  });

  test(`GIVEN a mobile carousel
        WHEN swiping to the next slide
        THEN the next slide should snap to the left side of the scroller`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    const boundingBox = await d.getSlideBoundingBoxAt(0);

    const startX = boundingBox.x + boundingBox.width * 0.8;
    const endX = boundingBox.x + boundingBox.width * 0.2;
    const y = boundingBox.y + boundingBox.height / 2;

    await page.touchscreen.tap(startX, y);
    await page.mouse.move(startX, y, { steps: 10 });
    await page.mouse.move(endX, y, { steps: 10 });
    await page.touchscreen.tap(endX, y);

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    const scrollerBox = await d.getScrollerBoundingBox();
    const secondSlideBox = await d.getSlideBoundingBoxAt(1);

    expect(Math.abs(secondSlideBox.x - scrollerBox.x)).toBeLessThan(1); // Allow 1px tolerance
  });

  test(`GIVEN a mobile carousel
    WHEN tapping the next button
    THEN the next slide should snap to the left side of the scroller`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getNextButton().tap();
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');

    const scrollerBox = await d.getScrollerBoundingBox();
    const secondSlideBox = await d.getSlideBoundingBoxAt(1);

    const gap = await page.evaluate(() => {
      const scroller = document.querySelector('[data-qui-carousel-scroller]');
      return parseInt(window.getComputedStyle(scroller!).getPropertyValue('gap'));
    });

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    const slideWidth = secondSlideBox.width;

    const actualDifference = Math.abs(secondSlideBox.x - scrollerBox.x);

    // within range (e.g., ±20 pixels)
    expect(Math.abs(actualDifference - slideWidth)).toBeLessThanOrEqual(20);
  });
});

test.describe('Accessibility', () => {
  test('Axe Validation Test', async ({ page }) => {
    await setup(page, 'hero');

    const initialResults = await new AxeBuilder({ page })
      .include('[data-qui-carousel]')
      .analyze();

    expect(initialResults.violations).toEqual([]);
  });

  test(`GIVEN a carousel
        WHEN it is rendered
        THEN it should have an accessible name`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    // remove this (there so that TS doesn't complain)
    d;

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute('aria-label', 'content slideshow');
  });

  test(`GIVEN a carousel with a title
        WHEN it is rendered
        THEN the title should be the accessible name`, async ({ page }) => {
    const { driver: d } = await setup(page, 'title');

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveAttribute('aria-labelledby');
  });

  test(`GIVEN a carousel
        WHEN it is rendered
        THEN the carousel container should have the role of group`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getRoot()).toBeVisible();
    await expect(d.getRoot()).toHaveRole('group');
  });

  test(`GIVEN a carousel
        WHEN it is rendered
        THEN the slide should have the accessible as its index out of the total slides`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getRoot()).toBeVisible();

    await expect(d.getSlideAt(1)).toHaveAccessibleName('2 of 7');
    await expect(d.getSlideAt(2)).toHaveAccessibleName('3 of 7');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN it is rendered
        THEN the parent of the slide tabs should have the role of tablist`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'pagination');

    // Verify the parent element has the role of 'tablist'
    await expect(d.getSlideTabsParent()).toHaveRole('tablist');
  });

  test(`GIVEN a carousel with a pagination control
        WHEN it is rendered
        THEN each bullet should have the role of tab`, async ({ page }) => {
    const { driver: d } = await setup(page, 'pagination');

    const bulletCount = await d.getTotalSlides();

    // Verify each bullet has the role of 'tab'
    for (let i = 0; i < bulletCount; i++) {
      const bullet = await d.getPaginationBullet(i);
      await expect(bullet).toHaveRole('tab');
    }
  });

  test(`GIVEN a carousel
        WHEN a slide is not the current slide
        THEN it should be inert`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(1)).toHaveAttribute('inert');

    await d.getNextButton().click();

    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(0)).toHaveAttribute('inert');
  });
});

test.describe('Looping', () => {
  test(`GIVEN a carousel with loop disabled
      WHEN navigating via keyboard to the last slide
      THEN the previous button should be focused after 2 seconds`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    const totalSlides = await d.getTotalSlides();

    for (let i = 0; i < totalSlides - 1; i++) {
      await d.getNextButton().press('Enter');
    }

    await expect(d.getSlideAt(totalSlides - 1)).toHaveAttribute('data-active');

    // if focus doesn't change in 2 seconds in next impl, then it focuses prev
    await page.waitForTimeout(2000);
    await expect(d.getPrevButton()).toBeFocused();
  });

  test(`GIVEN a carousel with loop disabled
      WHEN navigating via keyboard to the first slide
      THEN the next button should be focused after 2 seconds`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.getNextButton().press('Enter');
    await d.getPrevButton().press('Enter');

    await page.waitForTimeout(2000);
    await expect(d.getNextButton()).toBeFocused();
  });

  test(`GIVEN a carousel with loop disabled
        WHEN on the last slide
        THEN the next button should be disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    const totalSlides = await d.getTotalSlides();

    for (let i = 0; i < totalSlides - 1; i++) {
      await d.getNextButton().click();
    }

    await expect(d.getNextButton()).toBeDisabled();
  });

  test(`GIVEN a carousel with loop disabled
        WHEN on the first slide
        THEN the previous button should be disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await expect(d.getPrevButton()).toHaveAttribute('disabled'); //
  });

  test(`GIVEN a carousel with loop enabled
        WHEN on the last slide and the next button is clicked
        THEN it should move to the first slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'loop');

    const totalSlides = await d.getTotalSlides();
    for (let i = 0; i < totalSlides - 1; i++) {
      await d.getNextButton().click();
    }

    const lastSlide = d.getSlideAt(totalSlides - 1);

    await expect(lastSlide).toHaveAttribute('data-active');

    await expect(d.getNextButton()).toBeVisible();
    await expect(d.getNextButton()).toBeEnabled();
    await d.getNextButton().click();

    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with loop enabled
        WHEN on the first slide and the previous button is clicked
        THEN it should move to the last slide`, async ({ page }) => {
    const { driver: d } = await setup(page, 'loop');
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await d.getPrevButton().click();

    const totalSlides = await d.getTotalSlides();
    await expect(d.getSlideAt(totalSlides - 1)).toHaveAttribute('data-active');
  });
});

test.describe('Multiple slides', () => {
  test(`GIVEN a carousel with multiple slides per view set to 3
        WHEN the carousel is rendered
        THEN 3 slides should be visible at a time`, async ({ page }) => {
    const { driver: d } = await setup(page, 'multiple-slides');
    await expect(d.getRoot()).toBeVisible();
    await expect(d.getSlideAt(0)).toBeVisible();
    await expect(d.getSlideAt(1)).toBeVisible();
    await expect(d.getSlideAt(2)).toBeVisible();
  });

  test(`GIVEN a carousel with multiple slides per view set to 3
        WHEN the carousel is rendered
        THEN the first 3 slides should be interactive`, async ({ page }) => {
    const { driver: d } = await setup(page, 'multiple-slides');
    await expect(d.getRoot()).toBeVisible();
    await expect(d.getSlideAt(0)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(2)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(3)).not.toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with multiple slides per view set to 3
        WHEN the next button is clicked
        THEN the slides 2, 3, 4 should be interactive`, async ({ page }) => {
    const { driver: d } = await setup(page, 'multiple-slides');
    await expect(d.getRoot()).toBeVisible();
    await d.getNextButton().click();
    await expect(d.getSlideAt(0)).not.toHaveAttribute('data-active');
    await expect(d.getSlideAt(1)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(2)).toHaveAttribute('data-active');
    await expect(d.getSlideAt(3)).toHaveAttribute('data-active');
  });

  test(`GIVEN a carousel with multiple slides per view set to 3
        WHEN the carousel is rendered
        THEN slide 4 should not be interactive`, async ({ page }) => {
    const { driver: d } = await setup(page, 'multiple-slides');
    await expect(d.getRoot()).toBeVisible();
    await expect(d.getSlideAt(0)).not.toHaveAttribute('inert');
    await expect(d.getSlideAt(3)).toHaveAttribute('inert');
  });
});
