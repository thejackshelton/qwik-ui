import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { createTestDriver } from './combobox.driver';

async function setup(page: Page, exampleName: string) {
  await page.goto(`/headless/combobox/${exampleName}`);

  const driver = createTestDriver(page.getByRole('combobox'));

  return {
    driver,
  };
}

test.describe('Mouse Behavior', () => {
  test(`GIVEN a combobox
        WHEN clicking on the trigger
        THEN open up the listbox AND aria-expanded should be true`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.getTrigger().click();

    await expect(d.getListbox()).toBeVisible();
    await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  test(`GIVEN a combobox with an open listbox
        WHEN the trigger is clicked
        THEN close the listbox AND aria-expanded should be false`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.openListbox('click');

    await d.getTrigger().click();
    await expect(d.getListbox()).toBeHidden();
    await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  test(`GIVEN a combobox with an open listbox
        WHEN an option is clicked
        THEN close the listbox AND aria-expanded should be false`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.openListbox('click');

    await d.getItemAt(0).click();

    await expect(d.getListbox()).toBeHidden();
    await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  test(`GIVEN a combobox with an open listbox
        WHEN the 2nd option is clicked
        THEN the 2nd option should have aria-selected`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.openListbox('click');

    await d.getItemAt(1).click();

    await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`GIVEN a  combobox with an open listbox
        WHEN the 3rd option is clicked
        THEN the 3rd option should be the selected value`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    await d.openListbox('click');

    const thirdOptStr = await d.getItemAt(2).textContent();
    await d.getItemAt(2).click();

    await expect(d.getItemAt(2)).toHaveAttribute('aria-selected', 'true');
    await expect(d.getInput()).toHaveValue(thirdOptStr!);
  });

  test(`GIVEN a combobox
        WHEN adding new users and selecting a new user
        THEN the new user should be the selected value`, async ({ page }) => {
    const { driver: d } = await setup(page, 'add-items');

    await page.getByRole('button', { name: 'Add Fruits' }).click();

    await expect(d.getItems()).toHaveCount(11);

    await d.openListbox('click');
    const expectedValue = 'Durian';

    await expect(d.getItemAt(8)).toHaveText(expectedValue);
    await d.getItemAt(8).click();
    await expect(d.getInput()).toHaveValue(expectedValue);
  });

  test(`GIVEN an open combobox
        WHEN clicking on the group label
        THEN the listbox should remain open`, async ({ page }) => {
    const { driver: d } = await setup(page, 'group');

    await d.openListbox('click');

    const label = d.getRoot().getByRole('listitem').first();

    await expect(label).toBeVisible();
    await label.click();
    await expect(d.getListbox()).toBeVisible();
  });
});

test.describe('Keyboard Behavior', () => {
  test.describe('listbox open / close', () => {
    test(`GIVEN a combobox focused on the input
          WHEN pressing the down arrow key
          THEN open up the listbox`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.getInput().press('ArrowDown');
      await expect(d.getListbox()).toBeVisible();
    });

    test(`GIVEN a combobox focused on the input
    WHEN pressing the up arrow key
    THEN open up the listbox`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.getInput().press('ArrowUp');
      await expect(d.getListbox()).toBeVisible();
    });

    test(`GIVEN a combobox with an opened listbox
        WHEN pressing the escape key
        THEN the listbox should close
        AND aria-expanded should be false`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('click');

      await d.getInput().focus();
      await d.getInput().press('Escape');
      await expect(d.getListbox()).toBeHidden();
      await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
    });

    test(`GIVEN a  combobox with an opened listbox
          WHEN focusing something outside of the combobox's input
          THEN the listbox should close
          AND aria-expanded should be false`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('click');
      await d.getInput().press('Tab');
      await expect(d.getListbox()).toBeHidden();
      await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('data-highlighted navigation', () => {
    test(`GIVEN a combobox
        WHEN pressing the down arrow key
        THEN the listbox should be opened
        AND the first option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.getInput().press('ArrowDown');
      await expect(d.getListbox()).toBeVisible();

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN a  combobox
        WHEN pressing the up arrow
        THEN open up the listbox
        AND the last option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.getInput().press('ArrowUp');
      await expect(d.getListbox()).toBeVisible();

      await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN an open combobox
        WHEN pressing the end key
        THEN the last option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      await d.getInput().press('End');

      await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN an open combobox
        WHEN pressing the home key after the end key
        THEN the first option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      // to last index
      await d.getInput().press('End');
      await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');

      // to first index
      await d.getInput().press('Home');
      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN an open combobox
          WHEN the first option is highlighted and the down arrow key is pressed
          THEN the second option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      // first index highlighted

      await expect(d.getHighlightedItem()).toHaveAttribute('data-highlighted');

      await d.getHighlightedItem().focus();
      await d.getHighlightedItem().press('ArrowDown');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN an open  combobox
  WHEN the third option is highlighted and the up arrow key is pressed
  THEN the second option should have data-highlighted`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      await d.getHighlightedItem().press('ArrowDown');
      await d.getHighlightedItem().press('ArrowDown');
      1;

      await d.getHighlightedItem().press('ArrowUp');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
    });
  });

  test.describe('selecting options', () => {
    test(`GIVEN an opened combobox with the first option highlighted
          WHEN the Enter key is pressed
          THEN the listbox should be closed and aria-expanded should be false`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      await d.getInput().press('Enter');
      await expect(d.getListbox()).toBeHidden();
      await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
    });

    test(`GIVEN an open combobox
          WHEN an option has data-highlighted
          AND the Enter key is pressed
          THEN option value should be the selected value
          AND should have an aria-selected of true`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('Enter');

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      const expectedValue = await d.getItemAt(0).textContent();
      await d.getHighlightedItem().press('Enter');
      await expect(d.getInput()).toHaveValue(expectedValue!);
    });

    test(`GIVEN an open combobox
          WHEN an option has data-highlighted
          AND the Space key is pressed
          THEN the listbox should be closed and aria-expanded false`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('Space');

      // second option highlighted
      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      await d.getHighlightedItem().press('Space');
      await expect(d.getListbox()).toBeHidden();
      await expect(d.getTrigger()).toHaveAttribute('aria-expanded', 'false');
    });

    test(`GIVEN an open combobox
          WHEN an option has data-highlighted
          AND the Space key is pressed
          THEN option value should be the selected value
          AND should have an aria-selected of true`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('Space');

      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      const expectedValue = await d.getItemAt(0).textContent();
      await d.getTrigger().press('Space');
      await expect(d.getInput()).toHaveValue(expectedValue!);
    });

    test(`GIVEN an open combobox
          WHEN an option is selected
          THEN focus should go back to the trigger`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('Space');

      await d.getHighlightedItem().press('Enter');
      await expect(d.getTrigger()).toBeFocused();
    });

    test(`GIVEN no selected item and a placeholder
          WHEN pressing the right arrow key once
          THEN the first enabled option should be selected and have aria-selected`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      const firstItemValue = await d.getItemAt(0).textContent();
      await d.getTrigger().focus();
      await d.getTrigger().press('ArrowRight');

      expect(d.getInput()).toHaveValue(firstItemValue!);
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN no selected item and a placeholder
          WHEN pressing the right arrow key twice
          THEN the first enabled option should be selected and have aria-selected`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      const firstItemValue = await d.getItemAt(0).textContent();
      const secondItemValue = await d.getItemAt(1).textContent();

      await d.getTrigger().press('ArrowRight');
      await expect(d.getInput()).toHaveValue(firstItemValue!);
      await d.getTrigger().press('ArrowRight');

      await expect(d.getInput()).toHaveValue(secondItemValue!);
      await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN the second item is selected
          WHEN pressing the left arrow key
          THEN the first item should be selected and have aria-selected & data-highlighted`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      // get initial selected value
      // const firstItemValue = await getOptionAt(0).textContent();
      await d.getTrigger().focus();
      await d.getTrigger().press('ArrowRight');
      await expect(d.getInput()).toHaveValue('Tim');
      await d.getTrigger().press('ArrowRight');

      await d.getTrigger().press('ArrowLeft');
      await expect(d.getInput()).toHaveValue('Tim');
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
    });

    test(`GIVEN a combobox with a chosen option
          AND the down arrow key is pressed
          THEN the data-highlighted option should not change on re-open`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'hero');

      await d.openListbox('ArrowDown');

      // second option highlighted
      await d.getHighlightedItem().press('ArrowDown');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
      await d.getHighlightedItem().press('Enter');
      await expect(d.getListbox()).toBeHidden();

      await d.getHighlightedItem().press('ArrowDown');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
    });
  });

  test.describe('typeahead', () => {
    test(`GIVEN an open combobox with a typeahead support
          WHEN the user types in the letter "j"
          THEN the first option starting with the letter "j" should have data-highlighted`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');
      await d.getTrigger().press('j');
      const highlightedOpt = d.getRoot().locator('[data-highlighted]');
      await expect(highlightedOpt).toContainText('j', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with a typeahead support
          WHEN the user types in the letter "j" twice
          THEN the second option starting with the letter "j" should have data-highlighted`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');

      await d.getHighlightedItem().pressSequentially('jj', { delay: 1250 });
      await expect(d.getHighlightedItem()).toContainText('jessie', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with a typeahead support
          WHEN the user types in the letters "jjt"
          THEN the first option starting with the letter "t" should have data-highlighted`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');
      await d.getHighlightedItem().pressSequentially('jjt', { delay: 1250 });
      await expect(d.getHighlightedItem()).toContainText('tim', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with typeahead support and multiple characters
          WHEN the user types in the letter "a"
          AND waits a bit, then types in the letter "je"
          THEN the first option starting with "je" should have data-highlighted`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');
      await d.getHighlightedItem().pressSequentially('a', { delay: 1500 });
      await d.getHighlightedItem().pressSequentially('je', { delay: 100 });
      await expect(d.getHighlightedItem()).toContainText('jessie', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with typeahead support and multiple characters
          WHEN the user types in a letter that does not match any option
          THEN the data-highlighted value should not change.`, async ({ page }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');
      await d.getHighlightedItem().pressSequentially('am', { delay: 1250 });
      await expect(d.getHighlightedItem()).toContainText('abby', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with typeahead support and repeated characters
          WHEN the user types in a letter three times
          THEN the data-highlighted value should cycle through the options`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'typeahead');
      await d.openListbox('ArrowDown');
      await d.getHighlightedItem().pressSequentially('jjj', { delay: 1250 });
      await expect(d.getHighlightedItem()).toContainText('jim', { ignoreCase: true });
    });

    test(`GIVEN an open combobox with typeahead support and grouped options
          WHEN the user types a letter matching an option in one group
          AND the user types a letter matching an option in another group
          THEN the data-highlighted value should switch groups`, async ({ page }) => {
      const { driver: d } = await setup(page, 'group');
      await d.openListbox('ArrowDown');
      await d.getHighlightedItem().press('j');
      await expect(d.getHighlightedItem()).toContainText('Jim', { ignoreCase: true });
      await d.getHighlightedItem().press('d');
      await expect(d.getHighlightedItem()).toContainText('dog', { ignoreCase: true });
    });

    test(`GIVEN a closed combobox with typeahead support
          WHEN the user types a letter matching an option
          THEN the display value should first matching option`, async ({ page }) => {
      const { driver: d } = await setup(page, 'hero');
      await d.getTrigger().press('j');
      await expect(d.getTrigger()).toHaveText('Jim');
    });

    test(`GIVEN a closed combobox with typeahead support
          WHEN the user types a letter matching an option
          THEN the first matching option should be selected`, async ({ page }) => {
      // ideally want to refactor this so that even if the test example is changed, the test will still pass, getting it more programmatically.
      const { driver: d } = await setup(page, 'hero');
      await d.getTrigger().focus();
      const char = 'j';
      await d.getTrigger().press(char);
      const firstJOption = d.getRoot().locator('li', { hasText: char }).nth(0);
      await expect(firstJOption).toHaveAttribute('aria-selected', 'true');
      await expect(firstJOption).toHaveAttribute('data-highlighted');
    });
  });

  test.describe('looping', () => {
    test.describe('loop disabled', () => {
      test(`GIVEN an open basic combobox
          AND the last option is data-highlighted
          WHEN the down key is pressed
          THEN data-highlighted should stay on the last option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'hero');

        // initially last option is highlighted
        await d.openListbox('Enter');
        await d.getTrigger().press('End');

        await d.getItemAt('last').press('ArrowDown');
        await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');
      });

      test(`GIVEN an open basic combobox
          AND the first option is data-highlighted
          WHEN the up arrow key is pressed
          THEN data-highlighted should stay on the first option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'hero');

        await d.openListbox('Enter');
        const firstItem = d.getItemAt(0);
        await expect(firstItem).toHaveAttribute('data-highlighted');
        await firstItem.press('ArrowUp');
        await expect(firstItem).toHaveAttribute('data-highlighted');
      });

      test(`GIVEN a closed basic combobox
          AND the last option is selected
          WHEN the right arrow key is pressed
          THEN it should stay on the last option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'hero');

        // initially last option is highlighted & listbox closed
        await d.openListbox('Enter');
        await d.getTrigger().press('End');

        const lastItem = d.getItemAt('last');
        await expect(lastItem).toHaveAttribute('data-highlighted');
        await lastItem.press('Enter');
        await expect(lastItem).toHaveAttribute('aria-selected', 'true');
        await expect(d.getListbox()).toBeHidden();

        await d.getTrigger().press('ArrowRight');
        await expect(lastItem).toHaveAttribute('data-highlighted');
        await expect(lastItem).toHaveAttribute('aria-selected', 'true');
      });

      test(`GIVEN a closed basic combobox
          AND the first option is selected
          WHEN the left arrow key is pressed
          THEN it should stay on the first option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'hero');

        // initially first option is highlighted & listbox closed
        await d.openListbox('Enter');
        await expect(d.getListbox()).toBeVisible();
        await d.getTrigger().press('Enter');

        await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
        await expect(d.getListbox()).toBeHidden();

        await d.getTrigger().focus();
        await d.getTrigger().press('ArrowLeft');
        await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      });
    });

    test.describe('loop enabled', () => {
      test(`GIVEN an open combobox with loop enabled
            AND the last option is data-highlighted
            WHEN the down arrow key is pressed
            THEN the first option should have data-highlighted`, async ({ page }) => {
        const { driver: d } = await setup(page, 'loop');

        // initially last option is highlighted
        await d.openListbox('Enter');
        await d.getHighlightedItem().press('End');

        await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');

        await d.getHighlightedItem().press('ArrowDown');
        await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      });

      test(`GIVEN an open combobox with loop enabled
            AND the first option is data-highlighted
            WHEN the up arrow key is pressed
            THEN the last option should have data-highlighted`, async ({ page }) => {
        const { driver: d } = await setup(page, 'loop');

        // initially last option is highlighted
        await d.openListbox('Enter');
        await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');

        await d.getHighlightedItem().press('ArrowUp');
        await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');
      });

      test(`GIVEN a closed combobox with loop enabled
            AND the last option is selected
            WHEN the right arrow key is pressed
            THEN it should loop to the first option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'loop');

        // initially last option is highlighted
        await d.openListbox('Enter');
        await d.getHighlightedItem().press('End');
        await d.getHighlightedItem().press('Enter');

        await expect(d.getListbox()).toBeHidden();

        await expect(d.getItemAt('last')).toHaveAttribute('aria-selected', 'true');

        await d.getTrigger().focus();
        await d.getTrigger().press('ArrowRight');
        await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      });

      test(`GIVEN a closed combobox with loop enabled
            AND the first option is selected
            WHEN the right arrow key is pressed
            THEN it should loop to the first option`, async ({ page }) => {
        const { driver: d } = await setup(page, 'loop');

        // initially combobox first option
        await d.openListbox('Enter');
        await d.getHighlightedItem().press('Enter');

        await expect(d.getListbox()).toBeHidden();

        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');

        await d.getTrigger().focus();
        await d.getTrigger().press('ArrowLeft');
        await expect(d.getItemAt('last')).toHaveAttribute('data-highlighted');
        await expect(d.getItemAt('last')).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  test(`GIVEN an open combobox with multiple groups and a scrollable listbox
        AND the last option is not visible
        WHEN the end key is pressed
        THEN the last option should be visible`, async ({ page }) => {
    const { driver: d } = await setup(page, 'scrollable');

    await d.openListbox('Enter');

    await d.getHighlightedItem().press('End');

    await expect(d.getItemAt('last')).toBeInViewport();
  });
});

test.describe('Disabled', () => {
  test(`GIVEN an open disabled combobox with the first option disabled
        WHEN clicking the disabled option
        It should have aria-disabled`, async ({ page }) => {
    const { driver: d } = await setup(page, 'disabled');

    await d.openListbox('Enter');
    await d.getHighlightedItem().press('ArrowDown');
    await expect(d.getItemAt(0)).toBeDisabled();
  });

  test(`GIVEN an open disabled combobox
        WHEN first option is disabled
        THEN the second option should have data-highlighted`, async ({ page }) => {
    const { driver: d } = await setup(page, 'disabled');

    await d.openListbox('ArrowDown');

    await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
  });

  test(`GIVEN an open disabled combobox
        WHEN the last option is disabled and the end key is pressed
        THEN the second last index should have data-highlighted`, async ({ page }) => {
    const { driver: d } = await setup(page, 'disabled');

    await d.openListbox('ArrowDown');
    await d.getHighlightedItem().press('End');
    const length = await d.getItemsLength();
    const lastEnabledOption = d.getItemAt(length - 2);
    await expect(lastEnabledOption).toHaveAttribute('data-highlighted');
  });

  test(`GIVEN an open disabled combobox
        WHEN the second option is highlighted and the down arrow key is pressed
        AND the first and third options are disabled
        THEN the fourth option should be highlighted`, async ({ page }) => {
    const { driver: d } = await setup(page, 'disabled');

    await d.openListbox('ArrowDown');
    await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
    await d.getHighlightedItem().press('ArrowDown');
    await expect(d.getItemAt(3)).toHaveAttribute('data-highlighted');
  });

  test(`GIVEN an open disabled combobox
        WHEN the fourth is highlighted and the up key is pressed
        AND the first and third options are disabled
        THEN the second option should be highlighted`, async ({ page }) => {
    const { driver: d } = await setup(page, 'disabled');

    // initially the fourh option is highlighted
    await d.openListbox('ArrowDown');
    const secondOption = await d.getItemAt(1);
    await expect(secondOption).toHaveAttribute('data-highlighted');
    await d.getHighlightedItem().press('ArrowDown');
    await expect(d.getItemAt(3)).toHaveAttribute('data-highlighted');

    await d.getHighlightedItem().press('ArrowUp');
    await expect(secondOption).toHaveAttribute('data-highlighted');
  });
});

test.describe('Props', () => {
  test(`GIVEN a basic combobox
        WHEN there is a placeholder
        THEN the placeholder should be presented instead of a selected value`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');

    await expect(d.getInput()).toHaveValue('combobox an option');
  });

  test(`GIVEN a combobox with an onChange$ prop
        WHEN the combobox value changes
        THEN the placeholder should be presented instead of a selected value`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'change-value');

    await d.openListbox('click');

    await d.getItemAt(3).click();

    const sibling = d.getRoot().locator('+ p');
    await expect(sibling).toHaveText('You have changed 1 times');
  });

  test(`GIVEN a combobox with an onOpenChange$ prop
        WHEN the combobox value changes
        THEN the placeholder should be presented instead of a selected value`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'open-change');

    await d.openListbox('click');

    const sibling = d.getRoot().locator('+ p');
    await expect(sibling).toHaveText('The listbox opened and closed 1 time(s)');
  });

  test.describe('uncontrolled', () => {
    test(`GIVEN an uncontrolled combobox with a value prop on the root component
          WHEN the value data matches the fourth option
          THEN the selected value should be the data passed to the value prop
          AND the fourth option should have data-highlighted
          AND aria-selected set to true`, async ({ page }) => {
      const { driver: d } = await setup(page, 'uncontrolled');

      const expectedValue = await d.getItemAt(3).textContent();

      await expect(d.getInput()).toHaveValue(expectedValue!);
      await expect(d.getItemAt(3)).toHaveAttribute('data-highlighted');
      await expect(d.getItemAt(3)).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('controlled', () => {
    test(`GIVEN a controlled combobox with a bind:value prop on the root component
          WHEN the signal data matches the second option
          THEN the selected value should be the data passed to the bind:value prop
          AND should should have data-highlighted
          AND aria-selected set to true`, async ({ page }) => {
      const { driver: d } = await setup(page, 'controlled');

      const expectedValue = await d.getItemAt(1).textContent();

      await expect(d.getInput()).toHaveValue(expectedValue!);
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
      await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');
    });

    test(`GIVEN a controlled closed combobox with a bind:open prop on the root component
    WHEN the bind:open signal changes to true
    THEN the listbox should open to reflect the new signal value`, async ({ page }) => {
      const { driver: d } = await setup(page, 'bind-open');

      await expect(d.getListbox()).toBeHidden();

      page.getByRole('button', { name: 'Toggle open state' }).click();

      await expect(d.getListbox()).toBeVisible();
    });
  });

  test.describe('option value', () => {
    test(`GIVEN a combobox with distinct display and option values
          WHEN the 2nd option is selected
          THEN the selected value matches the 2nd option's value`, async ({ page }) => {
      const { driver: d } = await setup(page, 'item-value');

      await d.openListbox('Enter');

      await expect(page.locator('p')).toContainText('The selected value is: null');
      await d.getHighlightedItem().press('ArrowDown');
      await d.getHighlightedItem().press('Enter');

      await expect(page.locator('p')).toContainText('The selected value is: 1');
    });

    test(`GIVEN a combobox with distinct display and option values
          WHEN a controlled value is set to the 5th option
          THEN the selected value matches the 5th option's value`, async ({ page }) => {
      const { driver: d } = await setup(page, 'controlled-value');

      await expect(d.getTrigger()).toHaveText('Ryan');
      await page.getByRole('button', { name: 'Change to Abby' }).click();

      await expect(d.getTrigger()).toHaveText(`Abby`);
    });

    test(`GIVEN a combobox with distinct display and option values
          WHEN the 5th option is selected
          AND it clicks another option
          AND it goes back to the 5th option programmatically
          THEN the bind:value signal should update to reflect the 5th option's value`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'controlled-value');

      await expect(d.getTrigger()).toHaveText('Ryan');
      // setup
      await page.getByRole('button', { name: 'Change to Abby' }).click();
      await expect(d.getTrigger()).toHaveText(`Abby`);

      await d.openListbox('click');
      await d.getItemAt(1).click();
      await expect(d.getTrigger()).toHaveText(`Ryan`);
      await page.getByRole('button', { name: 'Change to Abby' }).click();
      await expect(d.getTrigger()).toHaveText(`Abby`);
    });
  });
});

/** TODO: add docs telling people how to add an aria-label to the root component. (accessible name) */
test.describe('A11y', () => {
  test('Axe Validation Test', async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');

    const initialResults = await new AxeBuilder({ page })
      .include('[role="combobox"]')
      .analyze();

    expect(initialResults.violations).toEqual([]);

    await d.openListbox('click');

    const afterClickResults = await new AxeBuilder({ page })
      .include('[role="combobox"]')
      .analyze();

    expect(afterClickResults.violations).toEqual([]);
  });

  test(`GIVEN a combobox with a group
        WHEN the user adds a new group
        THEN the group should have an aria-labelledby attribute
        AND its associated label`, async ({ page }) => {
    const { driver: d } = await setup(page, 'group');
    await d.openListbox('ArrowDown');
    const labelId = await d.getRoot().getByRole('listitem').first().getAttribute('id');

    await expect(d.getRoot().getByRole('group').first()).toHaveAttribute(
      'aria-labelledby',
      labelId!,
    );
  });

  test(`GIVEN an open  combobox with aria-activedescendent
        WHEN the listbox is opened and the down arrow key is pressed
        THEN aria-activedescendent should be the id of the second option`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');
    await d.openListbox('ArrowDown');
    await d.getHighlightedItem().press('ArrowDown');

    const secondOptionId = await d.getItemAt(1).getAttribute('id');

    await expect(d.getRoot()).toHaveAttribute(
      'aria-activedescendant',
      `${secondOptionId}`,
    );
  });

  test(`GIVEN an open  combobox with aria-activedescendent
        WHEN the listbox is closed
        THEN aria-activedescendent should be an empty string`, async ({ page }) => {
    const { driver: d } = await setup(page, 'hero');
    await d.openListbox('ArrowDown');
    await d.getHighlightedItem().press('Enter');
    await expect(d.getListbox()).toBeHidden();

    await expect(d.getRoot()).toHaveAttribute('aria-activedescendant', 'hero');
  });

  test(`GIVEN a  combobox with aria-controls
        WHEN the combobox renders
        THEN the root's aria-controls should be equal to the ID of the listbox`, async ({
    page,
  }) => {
    const { driver: d } = await setup(page, 'hero');
    await d.openListbox('Enter');
    const listboxId = await d.getListbox().getAttribute('id');

    await expect(d.getRoot()).toHaveAttribute('aria-controls', `${listboxId}`);
  });
});

test.describe('Multiple selection', () => {
  test.describe('mouse behavior', () => {
    test(`GIVEN a multi combobox
        WHEN clicking an option
        THEN the option should be selected
        AND the listbox should remain open`, async ({ page }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('click');
      await d.getItemAt(0).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await expect(d.getListbox()).toBeVisible();
    });

    test(`GIVEN a multi combobox
        WHEN clicking one option
        AND another option
        THEN both options should be selected`, async ({ page }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('click');
      await d.getItemAt(0).click();
      await d.getItemAt(1).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');
    });

    test(`GIVEN a multi combobox
          WHEN clicking one option
          AND clicking the same option again
          THEN it should toggle between selected and unselected`, async ({ page }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('click');
      await d.getItemAt(0).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await d.getItemAt(0).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'false');
    });

    test(`GIVEN a multi combobox
        WHEN clicking one option
        AND clicking another option
        THEN the selected value should contain both options`, async ({ page }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('click');
      await d.getItemAt(0).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await d.getItemAt(1).click();
      await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');

      await expect(d.getInput()).toHaveValue('Tim, Ryan');
    });
  });

  test.describe('keyboard behavior', () => {
    for (const key of ['Enter', 'Space']) {
      test(`GIVEN an open multi combobox
            WHEN pressing the ${key} key
            AND pressing the ${key} key again
            THEN the selected option should toggle between selected and unselected`, async ({
        page,
      }) => {
        const { driver: d } = await setup(page, 'multiple');
        await d.openListbox('Enter');
        await d.getHighlightedItem().press(key);
        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
        await d.getHighlightedItem().press(key);
        await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'false');
      });
    }

    test(`GIVEN a multi combobox
          WHEN selecting an option
          AND hitting the escape key
          THEN the listbox should be closed`, async ({ page }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('click');
      await d.getItemAt(0).click();
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
      await d.getHighlightedItem().press('Escape');
      await expect(d.getListbox()).toBeHidden();
    });

    test(`GIVEN a multi combobox
          WHEN hitting the shift + arrow down key
          THEN focus should move to the next option, and toggle that option`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'multiple');
      await d.openListbox('Enter');
      await d.getHighlightedItem().press('Shift+ArrowDown');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');
      await expect(d.getItemAt(1)).toHaveAttribute('aria-selected', 'true');
    });

    test(`GIVEN a multi combobox
          WHEN hitting the shift + arrow up key
          THEN focus should move to the previous option, and toggle that option`, async ({
      page,
    }) => {
      const { driver: d } = await setup(page, 'multiple');
      // initial setup
      await d.openListbox('Enter');
      await d.getHighlightedItem().press('ArrowDown');
      await expect(d.getItemAt(1)).toHaveAttribute('data-highlighted');

      await d.getHighlightedItem().press('Shift+ArrowUp');
      await expect(d.getItemAt(0)).toHaveAttribute('data-highlighted');
      await expect(d.getItemAt(0)).toHaveAttribute('aria-selected', 'true');
    });
  });
});
