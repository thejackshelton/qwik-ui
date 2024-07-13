import { component$, useStyles$, useSignal } from '@builder.io/qwik';
import { Tabs } from '@qwik-ui/headless';
import styles from '.././index.css?inline';

export default component$(() => {
  useStyles$(styles);

  const isSelected = useSignal(false);

  return (
    <>
      <div class="tabs-example mr-auto">
        <h3>Danish Composers</h3>
        <h4 class="mb-4">Click on the tab</h4>
        <Tabs.Root behavior="manual">
          <Tabs.List>
            <Tabs.Tab onClick$={() => (isSelected.value = true)}>Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel>Custom onClick was called: {`${isSelected.value}`}</Tabs.Panel>
        </Tabs.Root>
      </div>
    </>
  );
});
