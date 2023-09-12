import { component$, useSignal } from '@builder.io/qwik';

import { Card, CardBody, CardTitle } from '@qwik-ui/tailwind';

export default component$(() => {
  const controlledPopover = useSignal<boolean>(true);

  return <></>;
});

export const Box = component$(() => {
  return (
    <Card>
      <CardBody>
        <CardTitle>title</CardTitle>
        this is a card component
      </CardBody>
    </Card>
  );
});
