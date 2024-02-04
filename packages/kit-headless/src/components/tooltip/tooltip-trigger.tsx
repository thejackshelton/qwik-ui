import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { tooltipContextId } from './tooltip-context';
import { PopoverTrigger, usePopover } from '../popover';

export type TooltipTriggerProps = Omit<PropsOf<'button'>, 'popovertarget' | 'id' | 'ref'>;

export const TooltipTrigger = component$((props: TooltipTriggerProps) => {
  const context = useContext(tooltipContextId);
  const triggerId = `${context.localId}-trigger`;
  const popoverTarget = `${context.localId}-popover`;
  const { showPopover, hidePopover } = usePopover(popoverTarget);

  return (
    <PopoverTrigger
      {...props}
      disableClickInitPopover
      popovertarget={popoverTarget}
      ref={context.triggerRef}
      onPointerEnter$={[showPopover, props.onPointerEnter$]}
      onPointerLeave$={[hidePopover, props.onPointerLeave$]}
      id={triggerId}
    >
      <Slot />
    </PopoverTrigger>
  );
});
