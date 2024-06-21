import { QRL, Signal, createContextId } from '@builder.io/qwik';
import { TItemsMap } from './combobox-inline';

export const comboboxContextId = createContextId<ComboboxContext>('qui-combobox');

export type ComboboxContext = {
  isListboxOpenSig: Signal<boolean>;
  inputValueSig: Signal<string>;
  itemsMapSig: Readonly<Signal<TItemsMap>>;
  scrollOptions: ScrollIntoViewOptions;
  localId: string;

  // refs
  triggerRef: Signal<HTMLButtonElement | undefined>;
  inputRef: Signal<HTMLInputElement | undefined>;
  popoverRef: Signal<HTMLElement | undefined>;
  listboxRef: Signal<HTMLUListElement | undefined>;
  groupRef: Signal<HTMLDivElement | undefined>;
  labelRef: Signal<HTMLDivElement | undefined>;
  hubRef: Signal<HTMLDivElement | undefined>;
  selectedIndexSetSig: Signal<Set<number>>;
  highlightedIndexSig: Signal<number | null>;
  currDisplayValueSig: Signal<string | string[] | undefined>;
  disabledIndexSetSig: Signal<Set<number>>;

  loop: boolean;
  multiple: boolean | undefined;
  filter$?: QRL<(item: string, inputValue: string) => boolean>;
};

export const groupContextId = createContextId<GroupContext>('qui-combobox-group');

export type GroupContext = {
  groupLabelId: string;
};

export const comboboxItemContextId =
  createContextId<ComboboxItemContext>('qui-combobox-item');

export type ComboboxItemContext = {
  isSelectedSig: Signal<boolean>;
  itemLabelId: string;
};
