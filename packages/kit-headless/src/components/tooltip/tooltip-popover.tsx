import { component$, PropsOf, Slot, useContext } from '@builder.io/qwik';
import { Popover, PopoverProps } from '@qwik-ui/headless';
import { tooltipContextId } from './tooltip-context';

export type TooltipPopoverProps = PropsOf<'div'> & PopoverProps;

export const TooltipPopover = component$(
  ({ placement = 'top', ...props }: TooltipPopoverProps) => {
    const context = useContext(tooltipContextId);
    const popoverId = `${context.localId}-popover`;

    return (
      <Popover
        {...props}
        ref={context.popoverRef}
        anchorRef={context.triggerRef}
        floating={true}
        id={popoverId}
        placement={placement}
        manual
      >
        <Slot />
      </Popover>
    );
  },
);
