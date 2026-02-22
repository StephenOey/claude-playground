import type { AnimationConfig } from './animation';

export interface AnimationExport {
  version: '1.0';
  exportedAt: string; // ISO 8601
  animations: AnimationConfig[];
}
