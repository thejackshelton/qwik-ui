import { component$, useContext, type PropsOf } from '@builder.io/qwik';

import SelectContextId from './select-context';

type SelectValueProps = PropsOf<'span'> & {
  placeholder: string;
};

export const SelectValue = component$((props: SelectValueProps) => {
  const context = useContext(SelectContextId);
  const selectedOptStr = context.selectedOptionRef.value?.textContent;

  return (
    <span data-value {...props}>
      {selectedOptStr ?? context.value ?? props.placeholder}
    </span>
  );
});