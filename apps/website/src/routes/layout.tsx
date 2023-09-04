import { Slot, component$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { ContentMenu, useContent, useLocation } from '@builder.io/qwik-city';
import { loadComponent } from 'apps/website/utils/mdx-reader';
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

export default component$(() => {
  const store = useSignal<any>([]);
  const comp = useSignal<any>('');
  const loc: any = useLocation();
  useTask$(async () => {
    const parts = loc.url.pathname.split('/');
    parts.pop();
    const lastPart = parts.pop();
    console.log(lastPart);
    comp.value = lastPart;
    try {
      const { frontmatter }: any = await loadComponent(lastPart);
      store.value = { ...frontmatter.links };
    } catch (error) {
      return;
    }
  });

  function renderTitlesWithMargin(obj: any, marginLeft = 0) {
    const textStyle = `ml-${marginLeft}`;
    console.log(typeof obj.title, obj.title);

    return (
      <li key={obj.title} class={textStyle}>
        <a
          href={`${loc.url.href}#${
            typeof obj.title === 'string'
              ? obj.title
                  .toLowerCase()
                  .replaceAll(' ', '-')
                  .replaceAll(/[\uD800-\uDFFF]./g, '')
              : ''
          }`}
        >
          {obj.title}
        </a>
        {obj.items && (
          <ul>
            {obj.items.map((item: any) => (
              <li key={item.title} class={textStyle}>
                {renderTitlesWithMargin(item, marginLeft + 1)}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

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
              ​<ul class="flex flex-col gap-2">{renderTitlesWithMargin(store.value)}</ul>
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
