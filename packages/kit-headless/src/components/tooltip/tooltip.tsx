import {
  component$,
  PropsOf,
  Slot,
  useContextProvider,
  useId,
  useSignal,
} from '@builder.io/qwik';
import { tooltipContextId } from './tooltip-context';

export type TooltipProps = PropsOf<'div'>;

export const Tooltip = component$((props: TooltipProps) => {
  const localId = useId();
  const rootId = `${localId}-root`;

  const triggerRef = useSignal<HTMLButtonElement>();
  const popoverRef = useSignal<HTMLElement>();

  const context = {
    localId,
    triggerRef,
    popoverRef,
  };

  useContextProvider(tooltipContextId, context);

  return (
    <div id={rootId} role="tooltip" {...props}>
      <Slot />
    </div>
  );
});
