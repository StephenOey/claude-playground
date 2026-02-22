import { v4 as uuidv4 } from 'uuid';
import type { HoverAnimation, CarouselAnimation, ScrollAnimation } from '../types/animation';

export function defaultHover(): HoverAnimation {
  return {
    id: uuidv4(),
    type: 'hover',
    label: 'Hover Animation',
    targetSelector: '.my-element',
    enter: {
      duration: 0.3,
      ease: 'power2.out',
      scale: 1.05,
      y: -4,
      opacity: 1,
    },
    leave: {
      duration: 0.3,
      ease: 'power2.in',
      scale: 1,
      y: 0,
      opacity: 1,
    },
  };
}

export function defaultCarousel(): CarouselAnimation {
  return {
    id: uuidv4(),
    type: 'carousel',
    label: 'Carousel',
    targetSelector: '.carousel',
    itemSelector: '.carousel-item',
    visibleItems: 1,
    autoplay: false,
    autoplayDelay: 3,
    loop: true,
    transitionType: 'slide',
    duration: 0.5,
    ease: 'power2.inOut',
    dragEnabled: true,
  };
}

export function defaultScroll(): ScrollAnimation {
  return {
    id: uuidv4(),
    type: 'scroll',
    label: 'Scroll Animation',
    targetSelector: '.my-section',
    trigger: {
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: false,
      pin: false,
      toggleActions: 'play none none reverse',
    },
    tween: {
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0 },
      duration: 0.8,
      ease: 'power2.out',
    },
  };
}
