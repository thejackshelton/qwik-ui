import { component$, useStyles$ } from '@builder.io/qwik';
import {
  Select,
  SelectListbox,
  SelectOption,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '@qwik-ui/headless';
import styles from '../snippets/select.css?inline';

export default component$(() => {
  useStyles$(styles);
  const users = ['Tim', 'Ryan', 'Jim', 'Jessie', 'Abby'];

  return (
    <form preventdefault:submit>
      <Select class="select" aria-label="hero">
        <SelectTrigger class="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectPopover class="select-popover">
          <SelectListbox class="select-listbox">
            {users.map((user) => (
              <SelectOption key={user}>{user}</SelectOption>
            ))}
          </SelectListbox>
        </SelectPopover>
      </Select>
      <label style={{ display: 'flex', flexDirection: 'column' }}>
        Your favorite cat name
        <input type="text" />
      </label>
      <button type="submit">Submit my form!</button>
    </form>
  );
});
