import type { CarouselAnimation } from '../types/animation';

export function genCarouselCode(cfg: CarouselAnimation): string {
  const autoplayBlock = cfg.autoplay
    ? `
  // Autoplay
  let autoplayTimer = setInterval(() => goTo(currentIndex + 1), ${cfg.autoplayDelay * 1000});
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(currentIndex + 1), ${cfg.autoplayDelay * 1000});
  }
`
    : '';

  const dragBlock = cfg.dragEnabled
    ? `
  // Drag support
  let startX = 0;
  track.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  track.addEventListener('pointerup', (e) => {
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) goTo(currentIndex + (diff < 0 ? 1 : -1));
  });
`
    : '';

  const transitionFn =
    cfg.transitionType === 'slide'
      ? `gsap.to(track, { x: -currentIndex * itemWidth, duration: ${cfg.duration}, ease: '${cfg.ease}' });`
      : cfg.transitionType === 'fade'
      ? `gsap.to(items, { opacity: 0, duration: ${cfg.duration} / 2 });
  gsap.set(track, { x: -currentIndex * itemWidth });
  gsap.to(items[currentIndex], { opacity: 1, duration: ${cfg.duration} / 2 });`
      : `gsap.to(track, { rotationY: currentIndex * -90, duration: ${cfg.duration}, ease: '${cfg.ease}', transformOrigin: 'center center' });`;

  return `// ${cfg.label}
const carousel = document.querySelector('${cfg.targetSelector}');
const track = carousel.querySelector('${cfg.itemSelector}')?.parentElement;
const items = carousel.querySelectorAll('${cfg.itemSelector}');
const itemWidth = carousel.offsetWidth / ${cfg.visibleItems};
let currentIndex = 0;

function goTo(index) {
  ${cfg.loop ? `currentIndex = ((index % items.length) + items.length) % items.length;` : `currentIndex = Math.max(0, Math.min(index, items.length - 1));`}
  ${transitionFn}
}
${autoplayBlock}${dragBlock}
// Controls (wire these to your prev/next buttons)
// document.querySelector('.prev').addEventListener('click', () => goTo(currentIndex - 1));
// document.querySelector('.next').addEventListener('click', () => goTo(currentIndex + 1));`;
}
