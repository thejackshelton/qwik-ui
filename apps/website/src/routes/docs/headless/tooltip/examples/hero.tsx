import { component$ } from '@builder.io/qwik';
import { Tooltip, TooltipPopover, TooltipTrigger } from '@qwik-ui/headless';

export default component$(() => {
  return (
    <Tooltip>
      <TooltipTrigger class="hover:text-accent-foreground px-2 py-1 underline underline-offset-2 hover:font-medium">
        Hover me
      </TooltipTrigger>
      <TooltipPopover class="bg-muted text-muted-foreground textt-sm m-0 mb-2 rounded-lg px-3 py-2">
        Hi! This is the tooltip content. 😀
      </TooltipPopover>
    </Tooltip>
  );
});
