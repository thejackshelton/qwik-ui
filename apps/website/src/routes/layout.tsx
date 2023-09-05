import { Slot, component$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { ContentMenu, useContent, useLocation } from '@builder.io/qwik-city';
import { QwikUIProvider } from '@qwik-ui/headless';
import { ComponentsStatusesMap, statusByComponent } from '../_state/component-statuses';
import { KitName } from '../_state/kit-name.type';
import { useRootStore } from '../_state/use-root-store';
import Header from './_components/header/header';
import docsStyles from './docs.css?inline';
import {
  DocsNavigation,
  LinkGroup,
  LinkProps,
} from './docs/_components/navigation-docs/navigation-docs';
import { useSelectedKit } from './docs/use-selected-kit';
import prismStyles from './prism.css?inline';
// import stuff from './docs/headless/(components)/accordion/index.mdx';
export default component$(() => {
  const { headings } = useContent();
  const contentHeadings = headings?.filter((h) => h.level <= 3 && h.level >= 2) || [];
  const comp = useSignal<any>('');
  const loc: any = useLocation();

  useTask$(async () => {
    const parts = loc.url.pathname.split('/');
    parts.pop();
    const lastPart = parts.pop();

    comp.value = lastPart;
  });

  useStyles$(prismStyles);
  useStyles$(docsStyles);

  const { menuItemsGroups } = useKitMenuItems();
  const rootStore = useRootStore();

  return (
    <>
      <Header showBottomBorder={true} showVersion={true} />
      <QwikUIProvider>
        <div class="flex mt-20">
          <DocsNavigation linksGroups={menuItemsGroups} />
          <main class="docs">
            <Slot />
          </main>{' '}
          <div class="relative">
            <div class="hidden fixed 2xl:flex mt-8  flex-col gap-1">
              <a class="text-2xl" href={`${loc.url.href}#${comp.value}`}>
                <span class="hue-rotate-[150deg]">⚡</span>​
                <span class="capitalize">{comp.value}</span>
                <span class="hue-rotate-[210deg]">⚡</span>
              </a>
              {contentHeadings.length > 0 ? (
                <>
                  <ul class="px-2 flex flex-col font-medium gap-1">
                    {contentHeadings.map((h) => (
                      <a href={`#${h.id}`} class={`${h.level > 2 ? 'ml-4' : null}`}>
                        <li
                          key={h.id}
                          class="hover:bg-slate-400 hover:font-extrabold transition-[font-weight] hover:bg-opacity-40  ease-in px-2 py-1 rounded-md"
                        >
                          {h.text}
                        </li>
                      </a>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </QwikUIProvider>
      <footer></footer>
    </>
  );
});

function useKitMenuItems() {
  const selectedKitSig = useSelectedKit();
  const { menu } = useContent();
  let menuItemsGroups: LinkGroup[] | undefined = [];

  if (selectedKitSig.value === KitName.HEADLESS) {
    menuItemsGroups = decorateMenuItemsWithBadges(
      menu?.items,
      statusByComponent.headless,
    );
  }

  if (selectedKitSig.value === KitName.TAILWIND) {
    menuItemsGroups = decorateMenuItemsWithBadges(
      menu?.items,
      statusByComponent.tailwind,
    );
  }

  return {
    menuItemsGroups,
  };
}

function decorateMenuItemsWithBadges(
  menuItems: ContentMenu[] | undefined,
  kitStatusesMap: ComponentsStatusesMap,
): LinkGroup[] | undefined {
  return menuItems?.map((item) => {
    return {
      name: item.text,
      children: item.items?.map((child) => {
        const link: LinkProps = {
          name: child.text,
          href: child.href,
        };
        if (kitStatusesMap[link.name]) {
          link.status = kitStatusesMap[link.name];
        }
        return link;
      }),
    };
  });
}
