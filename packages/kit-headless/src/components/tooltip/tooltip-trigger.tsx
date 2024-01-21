import { component$, PropsOf, Slot, useContext } from '@builder.io/qwik';
import { tooltipContextId } from './tooltip-context';
import { PopoverTrigger, usePopover } from '../popover';

export type TooltipTriggerProps = PropsOf<'button'>;

export const TooltipTrigger = component$((props: TooltipTriggerProps) => {
  const context = useContext(tooltipContextId);
  const triggerId = `${context.localId}-trigger`;
  const popoverTarget = `${context.localId}-popover`;
  const { showPopover, hidePopover } = usePopover(popoverTarget);

  return (
    <PopoverTrigger
      disableClickInitPopover
      popovertarget={popoverTarget}
      ref={context.triggerRef}
      onPointerEnter$={[showPopover]}
      onPointerLeave$={[hidePopover]}
      id={triggerId}
      {...props}
    >
      <Slot />
    </PopoverTrigger>
  );
});
