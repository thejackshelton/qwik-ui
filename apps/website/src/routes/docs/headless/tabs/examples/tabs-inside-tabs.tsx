import { component$ } from '@builder.io/qwik';
import { Tabs } from '@qwik-ui/headless';

export default component$(() => {
  return (
    <Tabs.Root behavior="automatic">
      <Tabs.List>
        <Tabs.Tab>Tab 1</Tabs.Tab>
        <Tabs.Tab>Tab 2</Tabs.Tab>
        <Tabs.Tab>Tab 3</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
            <Tabs.Tab>Tab 3</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel>Panel 1</Tabs.Panel>
          <Tabs.Panel>Child Panel 2</Tabs.Panel>
          <Tabs.Panel>Panel 3</Tabs.Panel>
        </Tabs.Root>
      </Tabs.Panel>
      <Tabs.Panel>Root Panel 2</Tabs.Panel>
      <Tabs.Panel>Panel 3</Tabs.Panel>
    </Tabs.Root>
  );
});
