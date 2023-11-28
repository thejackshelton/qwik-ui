import { Signal } from '@builder.io/qwik';

export interface CarouselContext {
  // source of truth
  slideOffsetSig: Signal<number>;
  numSlidesSig: Signal<number>;
  spaceBetweenSlides: number;

  /* 
    refs 
    (I don't like adding sig to refs 
    because we know they are signals in qwik)
  */
  viewportRef: Signal<HTMLDivElement | undefined>;
  containerRef: Signal<HTMLDivElement | undefined>;
  slideRef: Signal<HTMLDivElement | undefined>;

  // animation
  transitionDurationSig: Signal<number>;

  // signal binds
  currentIndexSig: Signal<number>;

  // dragging
  absContainerTranslateXSig: Signal<number | null>;
  pointerUpFiredSig: Signal<boolean>;
}
