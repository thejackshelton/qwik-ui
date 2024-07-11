/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PropsOf, Slot, component$, useComputed$, useContext } from '@builder.io/qwik';
import { TAB_ID_PREFIX } from './tab';
import { tabsContextId } from './tabs-context-id';

export type TabPanelProps = {
  /** Optional tab contents. */
  label?: PropsOf<'div'>['children'];
  selected?: boolean;
  disabled?: boolean;

  /** @deprecated Internal use only */
  _tabId?: string;
  /** @deprecated Internal use only */
  _extraClass?: PropsOf<'div'>['class'];
} & PropsOf<'div'>;

export const TAB_PANEL_ID_PREFIX = '_tabpanel_';

export const HTabPanel = component$(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ label, _tabId, _extraClass, ...props }: TabPanelProps) => {
    const context = useContext(tabsContextId);

    const fullPanelElementId = context.tabsPrefix + TAB_PANEL_ID_PREFIX + _tabId!;
    const fullTabElementId = context.tabsPrefix + TAB_ID_PREFIX + _tabId!;

    const isSelectedSig = useComputed$(() => {
      return context.selectedTabIdSig.value === _tabId;
    });

    return (
      <div
        {...props}
        id={fullPanelElementId}
        aria-labelledby={fullTabElementId}
        role="tabpanel"
        tabIndex={0}
        hidden={!isSelectedSig.value}
      >
        <Slot />
      </div>
    );
  },
);
