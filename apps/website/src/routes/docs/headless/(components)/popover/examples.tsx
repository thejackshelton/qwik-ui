import { Slot, component$ } from '@builder.io/qwik';
import { PreviewCodeExample } from 'apps/website/src/routes/docs/_components/preview-code-example/preview-code-example';

export const MainExample = component$(() => {
  return (
    <PreviewCodeExample>
      <></>
      <div q:slot="codeExample">
        <Slot />
      </div>
    </PreviewCodeExample>
  );
});

export const Example1 = component$(() => {
  return (
    <PreviewCodeExample>
      <></>
      <div q:slot="codeExample">
        <Slot />
      </div>
    </PreviewCodeExample>
  );
});
