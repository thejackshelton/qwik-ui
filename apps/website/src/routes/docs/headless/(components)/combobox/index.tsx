import MDX from './index.mdx';
import { routeAction$, zod$, z } from '@builder.io/qwik-city';

export const useComboboxSearch = routeAction$(
  async ({ q }) => {
    console.log(q);
    const results = [
      { component: 'accordion', label: 'Accordion' },
      { component: 'combobox', label: 'Combobox' },
      { component: 'popover', label: 'Popover' },
      { component: 'select', label: 'Select' },
      { component: 'separator', label: 'Separator' },
      { component: 'tabs', label: 'Tabs' },
      { component: 'toggle', label: 'Toggle' },
      { component: 'tooltip', label: 'Tooltip' },
    ];

    if (q) {
      return results.filter((r) =>
        r.label.toLocaleLowerCase().includes(q.toLocaleLowerCase()),
      );
    } else {
      return [];
    }
  },
  zod$({
    q: z.string(),
  }),
);

export default MDX;
