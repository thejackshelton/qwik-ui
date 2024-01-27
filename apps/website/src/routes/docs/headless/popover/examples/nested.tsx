import { component$ } from '@builder.io/qwik';
import { Popover, PopoverTrigger } from '@qwik-ui/headless';

export default component$(() => {
  return (
    <PopoverTrigger class="rounded-md border-2 border-slate-300 bg-slate-800 px-3 py-1 text-white">
      <div>I am nested!</div>
      <Popover class="shadow-dark-medium rounded-md border-2 border-slate-300 bg-slate-800 px-3 py-1 text-white">
        <span>Click me!</span>
        My Hero!
      </Popover>
    </PopoverTrigger>
  );
});
