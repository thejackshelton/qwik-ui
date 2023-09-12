// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  type QwikIntrinsicElements,
  Slot,
  component$,
  useSignal,
  useVisibleTask$,
  Signal,
  useStylesScoped$,
} from '@builder.io/qwik';
import {
  ReferenceElement,
  autoUpdate,
  computePosition,
  offset as _offset,
  flip as _flip,
  shift as _shift,
  autoPlacement as _autoPlacement,
  hide as _hide,
} from '@floating-ui/dom';
// import '@oddbird/popover-polyfill/dist/popover.css';
import { isBrowser } from '@builder.io/qwik/build';

export type PopoverProps = {
  anchorRef?: Signal<HTMLElement | undefined>;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;
  gutter?: number;
  shift?: boolean;
  flip?: boolean;
  size?: boolean;
  autoPlacement?: boolean;
  hide?: 'referenceHidden' | 'escaped';
  inline?: boolean;
  transform?: string;
} & QwikIntrinsicElements['div'];

const isSupported =
  isBrowser &&
  typeof HTMLElement !== 'undefined' &&
  typeof HTMLElement.prototype === 'object' &&
  'popover' in HTMLElement.prototype;

const moduleScope: { containerDiv?: HTMLDivElement; imported?: boolean } = {};

function getPortalParent() {
  if (!moduleScope.containerDiv) {
    moduleScope.containerDiv = document.createElement('div');
    moduleScope.containerDiv.style.position = 'absolute';
    document.body.appendChild(moduleScope.containerDiv);
  }
  return moduleScope.containerDiv;
}

function getPopoverParent(floatingElement: HTMLElement) {
  const portalParent = getPortalParent();

  return isSupported ? floatingElement : portalParent;
}

export const Popover = component$(
  ({
    anchorRef,
    gutter,
    flip = true,
    placement = 'bottom-start',
    shift,
    hide,
    autoPlacement = false,
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false,
    transform,
    ...props
  }: PopoverProps) => {
    const base = useSignal<HTMLElement>();
    const popoverRef = useSignal<HTMLElement>();

    useStylesScoped$(`
      [data-child] {
        margin: 0;
        padding: 0;
        position: absolute;
        border: 0;
      }
    `);

    // sets floating UI config
    useVisibleTask$(({ track, cleanup }) => {
      if (!anchorRef || !anchorRef.value) return;
      const ref = track(() => anchorRef.value)!;

      const updatePosition = () => {
        const middleware = [
          _offset(gutter),
          _hide({ strategy: hide }),
          flip && _flip(),
          shift && _shift(),
          autoPlacement && _autoPlacement(),
        ];

        console.log(getPopoverParent(popoverRef.value!));

        computePosition(
          anchorRef?.value as ReferenceElement,
          getPopoverParent(popoverRef.value!),
          {
            placement,
            middleware,
          },
        ).then((resolvedData) => {
          if (!popoverRef.value) return;

          const { x, y } = resolvedData;

          console.log(getPopoverParent(popoverRef.value));

          const popoverParent = getPopoverParent(popoverRef.value);

          Object.assign(popoverParent.style, {
            left: `${x}px`,
            top: `${y}px`,
            transform,
          });

          console.log(x, y);
        });
      };

      const cleanupFunc = autoUpdate(
        ref,
        getPopoverParent(popoverRef.value!),
        updatePosition,
        {
          ancestorScroll,
          ancestorResize,
          elementResize,
          animationFrame,
        },
      );
      cleanup(cleanupFunc);
    });

    useVisibleTask$(async ({ cleanup }) => {
      if (isSupported) return;
      if (!moduleScope.imported) {
        await import('@oddbird/popover-polyfill');
        const css = (await import('@oddbird/popover-polyfill/dist/popover.css?inline'))
          .default;
        const styleNode = document.createElement('style');
        styleNode.textContent = css;
        document.head.appendChild(styleNode);
        moduleScope.imported = true;
      }
      cleanup(() => {
        base.value?.appendChild(moduleScope.containerDiv as Node);
      });
    });

    type ToggleEvent = {
      newState: string;
    };

    return (
      <div ref={base}>
        <div
          {...props}
          onToggle$={(e: ToggleEvent) => {
            if (isSupported || !popoverRef.value) {
              return;
            }
            // We need to have a place to put the popover which doesn't impact layout
            const floatingParent = getPortalParent();
            if (e.newState === 'open') {
              floatingParent.appendChild(popoverRef.value);
            } else {
              base.value?.appendChild(popoverRef.value);
            }
          }}
          ref={popoverRef}
          data-child
          popover
        >
          <Slot />
        </div>
      </div>
    );
  },
);
