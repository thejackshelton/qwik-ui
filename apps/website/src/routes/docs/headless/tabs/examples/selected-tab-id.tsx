import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Tabs } from '@qwik-ui/headless';
import styles from '.././index.css?inline';

export default component$(() => {
  useStyles$(styles);
  const selectedTabIdSig = useSignal<string | undefined>();
  return (
    <>
      <div class="tabs-example mr-auto">
        <h3>Danish Composers</h3>
        <Tabs.Root bind:selectedTabId={selectedTabIdSig}>
          <Tabs.List>
            <Tabs.Tab tabId="Maria">Maria</Tabs.Tab>
            <Tabs.Tab tabId="Carl">Carl</Tabs.Tab>
            <Tabs.Tab tabId="Ida">Ida</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel>
            <p>Maria Theresia Ahlefeldt (16 January 1755 - 20 December 1810) ...</p>
          </Tabs.Panel>
          <Tabs.Panel>
            <p>Carl Joachim Andersen (29 April 1847 - 7 May 1909) ...</p>
          </Tabs.Panel>
          <Tabs.Panel>
            <p>Ida Henriette da Fonseca (July 27, 1802 - July 6, 1858) ...</p>
          </Tabs.Panel>
        </Tabs.Root>
        <p class="mt-4">
          <strong>Selected Tab Id</strong>: {selectedTabIdSig.value}
        </p>
      </div>
    </>
  );
});
