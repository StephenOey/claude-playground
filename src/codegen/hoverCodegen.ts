import type { HoverAnimation, HoverState } from '../types/animation';

function serializeVars(state: HoverState): string {
  const skip = new Set(['duration', 'ease']);
  return Object.entries(state)
    .filter(([k, v]) => !skip.has(k) && v !== undefined)
    .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
    .join('\n');
}

export function genHoverCode(cfg: HoverAnimation): string {
  const enterVars = serializeVars(cfg.enter);
  const leaveVars = serializeVars(cfg.leave);

  return `// ${cfg.label}
const els = document.querySelectorAll('${cfg.targetSelector}');

els.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    gsap.to(el, {
      duration: ${cfg.enter.duration},
      ease: '${cfg.enter.ease}',
${enterVars}
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      duration: ${cfg.leave.duration},
      ease: '${cfg.leave.ease}',
${leaveVars}
    });
  });
});`;
}
