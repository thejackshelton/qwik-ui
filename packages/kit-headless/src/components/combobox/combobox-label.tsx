import {
  Slot,
  component$,
  useContext,
  type QwikIntrinsicElements,
} from '@builder.io/qwik';
import ComboboxContextId from './combobox-context-id';

export type ComboboxLabelProps = QwikIntrinsicElements['label'];

export const ComboboxLabel = component$((props: ComboboxLabelProps) => {
  const context = useContext(ComboboxContextId);
  const inputId = `${context.localId}-input`;

  return (
    <label for={inputId} {...props} ref={context.labelRef}>
      <Slot />
    </label>
  );
});
