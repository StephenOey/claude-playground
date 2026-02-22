import type { AnimationConfig } from '../types/animation';
import { genHoverCode } from './hoverCodegen';
import { genCarouselCode } from './carouselCodegen';
import { genScrollCode } from './scrollCodegen';

export function generateCode(config: AnimationConfig): string {
  switch (config.type) {
    case 'hover':    return genHoverCode(config);
    case 'carousel': return genCarouselCode(config);
    case 'scroll':   return genScrollCode(config);
  }
}

export function generateAllCode(configs: AnimationConfig[]): string {
  if (configs.length === 0) return '';
  return configs.map(generateCode).join('\n\n// ─────────────────────────────────────────────\n\n');
}
