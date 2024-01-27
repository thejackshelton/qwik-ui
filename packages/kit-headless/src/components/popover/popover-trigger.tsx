import {
  useOnDocument,
  useTask$,
  Slot,
  component$,
  useSignal,
  $,
  PropsOf,
  useContextProvider,
  useId,
} from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';
import { PopoverContext, popoverContextId } from './popover-context';

type PopoverTriggerProps = {
  popovertarget?: string;
  disableClickInitPopover?: boolean;
} & PropsOf<'button'>;

export function usePopover() {
  const popoverRef = useSignal<HTMLElement>();
  const localId = useId();

  const context: PopoverContext = {
    popoverRef,
    localId,
  };

  const hasPolyfillLoadedSig = useSignal<boolean>(false);
  const isSupportedSig = useSignal<boolean>(false);

  const didInteractSig = useSignal<boolean>(false);

  const loadPolyfill$ = $(async () => {
    await import('@oddbird/popover-polyfill');
    document.dispatchEvent(new CustomEvent('poppolyload'));
  });

  const initPopover$ = $(async () => {
    /* needs to run before poly load */
    const isSupported =
      typeof HTMLElement !== 'undefined' &&
      typeof HTMLElement.prototype === 'object' &&
      'popover' in HTMLElement.prototype;

    isSupportedSig.value = isSupported;

    if (!hasPolyfillLoadedSig.value && !isSupported) {
      await loadPolyfill$();
      hasPolyfillLoadedSig.value = true;
    }
    didInteractSig.value = true;
  });

  useTask$(({ track }) => {
    track(() => didInteractSig.value);

    if (!isBrowser) return;

    // so it only runs once on click for supported browsers
    if (isSupportedSig.value) {
      if (!popoverRef.value) return;

      if (popoverRef.value && popoverRef.value.hasAttribute('popover')) {
        /* opens manual on any event */
        popoverRef.value.showPopover();
      }
    }
  });

  // event is created after teleported properly
  useOnDocument(
    'showpopover',
    $(() => {
      if (!didInteractSig.value) return;

      if (!popoverRef.value) return;

      // calls code in here twice for some reason, we think it's because of the client re-render, but it still works

      // so it only runs once on first click
      if (!popoverRef.value.classList.contains(':popover-open')) {
        popoverRef.value.showPopover();
      }
    }),
  );

  const showPopover = $(async () => {
    if (!didInteractSig.value) {
      await initPopover$();
    }
    popoverRef.value?.showPopover();
  });

  const togglePopover = $(async () => {
    if (!didInteractSig.value) {
      await initPopover$();
    }
    popoverRef.value?.togglePopover();
  });

  const hidePopover = $(async () => {
    if (!didInteractSig.value) {
      await initPopover$();
    }
    popoverRef.value?.hidePopover();
  });

  return { showPopover, togglePopover, hidePopover, initPopover$, context };
}

export const PopoverTrigger = component$<PopoverTriggerProps>(
  ({ disableClickInitPopover = false, ...rest }: PopoverTriggerProps) => {
    const { initPopover$, context } = usePopover();
    const triggerId = `${context.localId}-trigger`;

    useContextProvider(popoverContextId, context);

    return (
      <button
        {...rest}
        id={triggerId}
        popovertarget={`${context.localId}-popover`}
        onClick$={[
          rest.onClick$,
          !disableClickInitPopover
            ? $(async () => {
                await initPopover$();
              })
            : undefined,
        ]}
      >
        <Slot />
      </button>
    );
  },
);
