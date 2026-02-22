export type AnimationType = 'hover' | 'carousel' | 'scroll';

export interface BaseAnimation {
  id: string;
  type: AnimationType;
  label: string;
  targetSelector: string;
}

// ─── Hover ────────────────────────────────────────────────────────────────────

export interface HoverState {
  duration: number;
  ease: string;
  scale?: number;
  y?: number;
  x?: number;
  opacity?: number;
  rotation?: number;
}

export interface HoverAnimation extends BaseAnimation {
  type: 'hover';
  enter: HoverState;
  leave: HoverState;
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

export type CarouselTransition = 'slide' | 'fade' | 'flip';

export interface CarouselAnimation extends BaseAnimation {
  type: 'carousel';
  itemSelector: string;
  visibleItems: number;
  autoplay: boolean;
  autoplayDelay: number;
  loop: boolean;
  transitionType: CarouselTransition;
  duration: number;
  ease: string;
  dragEnabled: boolean;
}

// ─── Scroll ───────────────────────────────────────────────────────────────────

export interface TweenVars {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotation?: number;
}

export interface ScrollTriggerConfig {
  start: string;
  end: string;
  scrub: boolean | number;
  pin: boolean;
  toggleActions: string;
}

export interface ScrollTween {
  from: TweenVars;
  to: TweenVars;
  duration: number;
  ease: string;
  stagger?: number;
}

export interface ScrollAnimation extends BaseAnimation {
  type: 'scroll';
  trigger: ScrollTriggerConfig;
  tween: ScrollTween;
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type AnimationConfig = HoverAnimation | CarouselAnimation | ScrollAnimation;
