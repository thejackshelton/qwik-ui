import { component$, useSignal, useStore, useStyles$ } from '@builder.io/qwik';
import { Tabs, Label } from '@qwik-ui/headless';
import styles from '.././index.css?inline';

export default component$(() => {
  useStyles$(styles);
  const tabsState = useStore([
    'Dynamic Tab 1',
    'Dynamic Tab 2',
    'Dynamic Tab 3',
    'Dynamic Tab 4',
  ]);
  const inputValue = useSignal<string>('0');

  return (
    <>
      <div class="tabs-example mr-auto">
        <Tabs.Root>
          <Tabs.List>
            {tabsState.map((tab) => (
              <Tabs.Tab key={tab}>{tab}</Tabs.Tab>
            ))}
          </Tabs.List>
          {tabsState.map((tab) => (
            <Tabs.Panel key={tab}>{tab} Panel</Tabs.Panel>
          ))}
        </Tabs.Root>

        <button
          class="mt-4 font-bold text-red-600"
          onClick$={() => {
            if (tabsState.length > 1) {
              tabsState.splice(parseInt(inputValue.value), 1);
            }
          }}
        >
          Remove Tab
        </button>

        <Label
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '1rem',
            width: 'fit-content',
          }}
        >
          <span>Index to remove:</span>
          <input bind:value={inputValue} />
        </Label>
      </div>
    </>
  );
});
