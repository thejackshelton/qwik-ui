import { Signal, createContextId } from '@builder.io/qwik';

export const popoverContextId = createContextId<PopoverContext>('qwikui-popover');

export type PopoverContext = {
  popoverRef: Signal<HTMLElement | undefined>;
  localId: string;
};
