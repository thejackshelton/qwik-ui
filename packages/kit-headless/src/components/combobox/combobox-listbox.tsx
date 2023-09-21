import {
  component$,
  useContext,
  type QwikIntrinsicElements,
  QRL,
} from '@builder.io/qwik';

import { JSX } from '@builder.io/qwik/jsx-runtime';

import ComboboxContextId from './combobox-context-id';
import type { ComboboxContext, Option } from './combobox-context.type';
import { ResolvedOption } from './combobox';
import { Popover } from '../popover';

export type ComboboxListboxProps<O extends Option = Option> = {
  optionRenderer$?: QRL<
    (resolved: ResolvedOption<O>, filteredIndex: number) => JSX.Element
  >;

  // main floating UI props
  placement?: 'top' | 'bottom' | 'right' | 'left';
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;

  // middleware
  gutter?: number;
  shift?: boolean;
  flip?: boolean;
  size?: boolean;
  autoPlacement?: boolean;
  hide?: 'referenceHidden' | 'escaped';
  inline?: boolean;

  // misc
  transform?: string;
} & QwikIntrinsicElements['ul'];

export const ComboboxListbox = component$(
  <O extends Option = Option>({ optionRenderer$, ...props }: ComboboxListboxProps<O>) => {
    const context = useContext<ComboboxContext<O>>(ComboboxContextId);
    const listboxId = `${context.localId}-listbox`;
    const popoverId = `${context.localId}-popover`;

    return (
      <Popover id={popoverId}>
        <ul
          {...props}
          id={listboxId}
          ref={context.listboxRef}
          aria-label={
            context.labelRef.value ? context.labelRef.value?.innerText : 'Suggestions'
          }
          role="listbox"
        >
          {context.filteredOptionsSig.value.map((resolved, filteredIndex) =>
            optionRenderer$?.(resolved, filteredIndex),
          )}
        </ul>
      </Popover>
    );
  },
);
