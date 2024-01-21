import { component$, PropsOf, Slot, useContext } from '@builder.io/qwik';
import { Popover } from '@qwik-ui/headless';
import { tooltipContextId } from './tooltip-context';

export type TooltipPopoverProps = PropsOf<'div'>;

export const TooltipPopover = component$(({ ...props }: TooltipPopoverProps) => {
  const context = useContext(tooltipContextId);
  const popoverId = `${context.localId}-popover`;

  return (
    <Popover
      {...props}
      ref={context.popoverRef}
      anchorRef={context.triggerRef}
      floating={true}
      id={popoverId}
      placement="top"
      manual
    >
      <Slot />
    </Popover>
  );
});
