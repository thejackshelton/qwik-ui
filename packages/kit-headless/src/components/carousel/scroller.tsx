import {
  component$,
  type PropsOf,
  Slot,
  useContext,
  useSignal,
  $,
} from '@builder.io/qwik';
import { carouselContextId } from './context';
import { useStyles$ } from '@builder.io/qwik';
import styles from './carousel.css?inline';

type CarouselContainerProps = PropsOf<'div'>;

export const CarouselScroller = component$((props: CarouselContainerProps) => {
  const context = useContext(carouselContextId);
  useStyles$(styles);
  const isMouseDownSig = useSignal(false);
  const startXSig = useSignal<number>();
  const scrollLeftSig = useSignal(0);

  const handleMouseMove$ = $((e: MouseEvent) => {
    if (!isMouseDownSig.value || startXSig.value === undefined) return;
    if (!context.containerRef.value) return;
    const x = e.pageX - context.containerRef.value.offsetLeft;
    const SCROLL_SPEED = 1.75;
    const walk = (x - startXSig.value) * SCROLL_SPEED;
    context.containerRef.value.scrollLeft = scrollLeftSig.value - walk;
  });

  const handleMouseDown$ = $((e: MouseEvent) => {
    if (!context.isDraggableSig.value) return;
    if (!context.containerRef.value) return;
    isMouseDownSig.value = true;
    startXSig.value = e.pageX - context.containerRef.value.offsetLeft;
    scrollLeftSig.value = context.containerRef.value.scrollLeft;
    window.addEventListener('mousemove', handleMouseMove$);
  });

  const handleMouseSnap$ = $(() => {
    if (!context.containerRef.value) return;
    isMouseDownSig.value = false;
    window.removeEventListener('mousemove', handleMouseMove$);

    const container = context.containerRef.value;
    const slides = context.slideRefsArray.value;
    const containerScrollLeft = container.scrollLeft;

    let closestSlide = slides[0].value;
    let closestSlideIndex = 0;
    let minDistance = Math.abs(containerScrollLeft - closestSlide.offsetLeft);

    slides.forEach((slideRef, index) => {
      if (!slideRef.value) return;
      const distance = Math.abs(containerScrollLeft - slideRef.value.offsetLeft);
      if (distance < minDistance) {
        closestSlide = slideRef.value;
        minDistance = distance;
        closestSlideIndex = index;
      }
    });

    const slideWidth = closestSlide.getBoundingClientRect().width;
    const slideMarginLeft = parseFloat(getComputedStyle(closestSlide).marginLeft);
    const slideMarginRight = parseFloat(getComputedStyle(closestSlide).marginRight);
    const totalSlideWidth = slideWidth + slideMarginLeft + slideMarginRight;
    const snapPosition = closestSlideIndex * totalSlideWidth;

    container.scrollTo({
      left: snapPosition,
      behavior: 'smooth',
    });

    context.currentIndexSig.value = closestSlideIndex;
  });

  return (
    <div
      ref={context.containerRef}
      onMouseDown$={[handleMouseDown$, props.onMouseDown$]}
      window:onMouseUp$={[handleMouseSnap$, props['window:onPointerUp$']]}
      data-draggable={context.isDraggableSig.value ? '' : undefined}
      data-qui-carousel-container
      preventdefault:mousemove
      {...props}
    >
      <Slot />
    </div>
  );
});
