import { Signal, createContextId } from '@builder.io/qwik';

export type TooltipContext = {
  localId: string;
  triggerRef: Signal<HTMLButtonElement | undefined>;
  popoverRef: Signal<HTMLElement | undefined>;
};

export const tooltipContextId = createContextId<TooltipContext>('qwikui-tooltip');
