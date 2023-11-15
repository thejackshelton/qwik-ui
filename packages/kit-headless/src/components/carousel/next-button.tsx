import { Slot, component$, useContext, useTask$ } from '@builder.io/qwik';
import { CarouselButtonProps } from './types';
import CarouselContextId from './carousel-context-id';

export const CarouselNext = component$((props: CarouselButtonProps) => {
  const context = useContext(CarouselContextId);

  useTask$(({ track }) => {
    track(() => context.totalSlidesSig.value);
    track(() => context.currentSlideSig.value);

    console.log('current slide: ', context.currentSlideSig.value);
    console.log('total slide', context.totalSlidesSig.value);
  });

  return (
    <button
      {...props}
      disabled={context.currentSlideSig.value === context.totalSlidesSig.value}
      style={
        context.currentSlideSig.value === context.totalSlidesSig.value
          ? { background: 'rgba(51, 65, 85, .35)' }
          : ''
      }
      onClick$={() => {
        context.currentSlideSig.value++;

        if (context.slideRef.value || context.slideRef.value === 0) {
          context.slideOffset.value =
            context.slideOffset.value - context.slideRef.value.offsetWidth;
        }
      }}
    >
      <Slot />
    </button>
  );
});

/*

nextButton.tsx and prevButton.tsx: These components represent the buttons for navigating to the next and previous slides. They should receive a callback prop from the Carousel component to update the current slide state.

*/