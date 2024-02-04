import { component$, type PropsOf, Slot, useContext } from '@builder.io/qwik';
import { Popover, type PopoverProps } from '@qwik-ui/headless';
import { tooltipContextId } from './tooltip-context';

type RawTooltipPopoverProps = PropsOf<'div'> & PopoverProps;

export type TooltipPopoverProps = Omit<
  RawTooltipPopoverProps,
  'id' | 'ref' | 'anchorRef'
>;

export const TooltipPopover = component$(
  ({ placement = 'top', ...props }: TooltipPopoverProps) => {
    const context = useContext(tooltipContextId);
    const popoverId = `${context.localId}-popover`;

    return (
      <Popover
        {...props}
        ref={context.popoverRef}
        anchorRef={context.triggerRef}
        floating
        id={popoverId}
        placement={placement}
        manual
      >
        <Slot />
      </Popover>
    );
  },
);
