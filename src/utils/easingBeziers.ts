import gsap from 'gsap';

/**
 * Approximate cubic-bezier control points [x1, y1, x2, y2] for named GSAP eases.
 * Elastic and bounce are NOT included — they require multi-segment curves and
 * are handled by sampling via gsap.parseEase.
 */
export const EASE_BEZIERS: Record<string, [number, number, number, number]> = {
  'none':             [0, 0, 1, 1],

  // Power (polynomial)
  'power1.in':        [0.55, 0.085, 0.68, 0.53],
  'power1.out':       [0.25, 0.46, 0.45, 0.94],
  'power1.inOut':     [0.455, 0.03, 0.515, 0.955],

  'power2.in':        [0.55, 0.055, 0.675, 0.19],
  'power2.out':       [0.215, 0.61, 0.355, 1],
  'power2.inOut':     [0.645, 0.045, 0.355, 1],

  'power3.in':        [0.895, 0.03, 0.685, 0.22],
  'power3.out':       [0.165, 0.84, 0.44, 1],
  'power3.inOut':     [0.77, 0, 0.175, 1],

  'power4.in':        [0.755, 0.05, 0.855, 0.06],
  'power4.out':       [0.23, 1, 0.32, 1],
  'power4.inOut':     [0.86, 0, 0.07, 1],

  // Sine
  'sine.in':          [0.47, 0, 0.745, 0.715],
  'sine.out':         [0.39, 0.575, 0.565, 1],
  'sine.inOut':       [0.445, 0.05, 0.55, 0.95],

  // Circ
  'circ.in':          [0.6, 0.04, 0.98, 0.335],
  'circ.out':         [0.075, 0.82, 0.165, 1],
  'circ.inOut':       [0.785, 0.135, 0.15, 0.86],

  // Expo
  'expo.in':          [0.95, 0.05, 0.795, 0.035],
  'expo.out':         [0.19, 1, 0.22, 1],
  'expo.inOut':       [1, 0, 0, 1],

  // Back (default overshoot 1.7)
  'back.in(1.7)':     [0.6, -0.28, 0.735, 0.045],
  'back.out(1.7)':    [0.175, 0.885, 0.32, 1.275],
  'back.inOut(1.7)':  [0.68, -0.55, 0.265, 1.55],
};

/** Parse a `cubic-bezier(x1, y1, x2, y2)` string into a tuple. Returns null on failure. */
export function parseCubicBezier(value: string): [number, number, number, number] | null {
  const m = value.match(/cubic-bezier\(\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*\)/);
  if (!m) return null;
  return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])];
}

/** Format four bezier coords into a `cubic-bezier(...)` string, rounded to 3 decimal places. */
export function formatCubicBezier(x1: number, y1: number, x2: number, y2: number): string {
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return `cubic-bezier(${r(x1)}, ${r(y1)}, ${r(x2)}, ${r(y2)})`;
}

/**
 * Bernstein Y(t) for cubic bezier with P0=(0,0), P1=(x1,y1), P2=(x2,y2), P3=(1,1).
 * This is the parametric T→Y formula used for visual curve display.
 */
export function sampleCubicBezier(
  _x1: number,
  y1: number,
  _x2: number,
  y2: number,
  t: number,
): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
}

/**
 * Sample an ease function into [t, value] pairs for SVG polyline drawing.
 * - cubic-bezier strings: use the parametric Bernstein Y formula
 * - All other GSAP ease names: delegate to gsap.parseEase (handles elastic, bounce, back, etc.)
 */
export function sampleEase(easeName: string, steps = 60): [number, number][] {
  const points: [number, number][] = [];

  if (easeName.startsWith('cubic-bezier(')) {
    const parsed = parseCubicBezier(easeName);
    if (!parsed) return [[0, 0], [1, 1]];
    const [x1, y1, x2, y2] = parsed;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push([t, sampleCubicBezier(x1, y1, x2, y2, t)]);
    }
  } else {
    let fn: ((t: number) => number) | null = null;
    try {
      const parsed = gsap.parseEase(easeName);
      if (typeof parsed === 'function') fn = parsed as (t: number) => number;
    } catch {
      // ignore — fall back to linear
    }
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push([t, fn ? fn(t) : t]);
    }
  }

  return points;
}
