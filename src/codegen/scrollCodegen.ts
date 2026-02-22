import type { ScrollAnimation, TweenVars } from '../types/animation';

function serializeTweenVars(vars: TweenVars): string {
  return Object.entries(vars)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `    ${k}: ${JSON.stringify(v)},`)
    .join('\n');
}

export function genScrollCode(cfg: ScrollAnimation): string {
  const { trigger, tween } = cfg;
  const fromVars = serializeTweenVars(tween.from);
  const toVars = serializeTweenVars(tween.to);
  const staggerLine = tween.stagger !== undefined ? `\n    stagger: ${tween.stagger},` : '';

  return `// ${cfg.label}
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
  '${cfg.targetSelector}',
  {
${fromVars}
  },
  {
${toVars}
    duration: ${tween.duration},
    ease: '${tween.ease}',${staggerLine}
    scrollTrigger: {
      trigger: '${cfg.targetSelector}',
      start: '${trigger.start}',
      end: '${trigger.end}',
      scrub: ${JSON.stringify(trigger.scrub)},
      pin: ${trigger.pin},
      toggleActions: '${trigger.toggleActions}',
    },
  }
);`;
}
