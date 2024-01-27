import { component$ } from '@builder.io/qwik';
import { Tooltip, TooltipPopover, TooltipTrigger } from '@qwik-ui/headless';

export default component$(() => {
  return (
    <Tooltip>
      <TooltipTrigger popovertarget="hero-tooltip">Trigger!</TooltipTrigger>
      <TooltipPopover placement="bottom" class="m-0 bg-blue-600" id="hero-tooltip">
        Popover!
      </TooltipPopover>
    </Tooltip>
  );
});
