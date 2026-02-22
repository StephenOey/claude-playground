import { useState, useEffect, useRef } from 'react';
import { EASING_OPTIONS } from '../../utils/easing';
import {
  EASE_BEZIERS,
  parseCubicBezier,
  formatCubicBezier,
  sampleEase,
} from '../../utils/easingBeziers';

// ── SVG coordinate system ──────────────────────────────────────────────────
const SVG_W = 220;
const SVG_H = 180;
const PAD_L = 16, PAD_R = 16, PAD_T = 16, PAD_B = 16;
const INNER_W = SVG_W - PAD_L - PAD_R; // 188
const INNER_H = SVG_H - PAD_T - PAD_B; // 148
const Y_MAX = 1.35;
const Y_RANGE = 1.70; // spans Y_MIN=-0.35 to Y_MAX=1.35

function svgX(t: number) { return PAD_L + t * INNER_W; }
function svgY(v: number) { return PAD_T + (Y_MAX - v) / Y_RANGE * INNER_H; }
function clamp(val: number, min: number, max: number) { return Math.min(Math.max(val, min), max); }

const DEFAULT_BEZIER: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  label?: string;
  value: string;
  onChange: (ease: string) => void;
}

export function EasingEditor({ label, value, onChange }: Props) {
  const isCustom = value.startsWith('cubic-bezier(');

  const [mode, setMode] = useState<'preset' | 'custom'>(() => isCustom ? 'custom' : 'preset');
  const [bezier, setBezier] = useState<[number, number, number, number]>(() => {
    if (isCustom) return parseCubicBezier(value) ?? DEFAULT_BEZIER;
    return EASE_BEZIERS[value] ?? DEFAULT_BEZIER;
  });

  const dragging = useRef<'p1' | 'p2' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastPreset = useRef<string>(isCustom ? 'power2.out' : value);

  // ── Sync from prop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (value.startsWith('cubic-bezier(')) {
      setMode('custom');
      const parsed = parseCubicBezier(value);
      if (parsed) setBezier(parsed);
    } else {
      setMode('preset');
      lastPreset.current = value;
      const lookup = EASE_BEZIERS[value];
      if (lookup) setBezier(lookup);
    }
  }, [value]);

  // ── Drag listeners (always attached) ──────────────────────────────────
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const localX = (e.clientX - rect.left) * (SVG_W / rect.width);
      const localY = (e.clientY - rect.top) * (SVG_H / rect.height);
      const t = clamp((localX - PAD_L) / INNER_W, 0, 1);
      const v = Y_MAX - ((localY - PAD_T) / INNER_H) * Y_RANGE;
      setBezier(prev => {
        const next = [...prev] as [number, number, number, number];
        if (dragging.current === 'p1') { next[0] = t; next[1] = v; }
        else                           { next[2] = t; next[3] = v; }
        onChange(formatCubicBezier(next[0], next[1], next[2], next[3]));
        return next;
      });
    }

    function onMouseUp() { dragging.current = null; }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onChange]);

  // ── Derived SVG geometry ───────────────────────────────────────────────
  const p0x = svgX(0), p0y = svgY(0);
  const p3x = svgX(1), p3y = svgY(1);
  const cp1x = svgX(bezier[0]), cp1y = svgY(bezier[1]);
  const cp2x = svgX(bezier[2]), cp2y = svgY(bezier[3]);

  const polylinePoints = mode === 'preset'
    ? sampleEase(value).map(([t, v]) => `${svgX(t)},${svgY(v)}`).join(' ')
    : '';

  const customPath = `M ${p0x} ${p0y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p3x} ${p3y}`;

  // ── Handlers ───────────────────────────────────────────────────────────
  function startDrag(e: React.MouseEvent, handle: 'p1' | 'p2') {
    e.preventDefault();
    if (mode !== 'custom') {
      const seed = EASE_BEZIERS[value] ?? DEFAULT_BEZIER;
      setBezier(seed);
      onChange(formatCubicBezier(seed[0], seed[1], seed[2], seed[3]));
    }
    dragging.current = handle;
  }

  function switchToPreset() {
    onChange(lastPreset.current);
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        {label && <span className="text-xs text-zinc-400">{label}</span>}
        {mode === 'custom' && (
          <button
            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
            onClick={switchToPreset}
          >
            ← Presets
          </button>
        )}
      </div>

      {/* SVG graph */}
      <svg
        ref={svgRef}
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full rounded bg-zinc-900 border border-zinc-800"
        style={{ touchAction: 'none' }}
      >
        {/* Grid lines (faint) */}
        {[0.25, 0.5, 0.75].map(v => (
          <line
            key={`vg-${v}`}
            x1={svgX(v)} y1={PAD_T}
            x2={svgX(v)} y2={PAD_T + INNER_H}
            stroke="#3f3f46" strokeWidth="1"
          />
        ))}
        {[0.25, 0.5, 0.75].map(v => (
          <line
            key={`hg-${v}`}
            x1={PAD_L}         y1={svgY(v)}
            x2={PAD_L + INNER_W} y2={svgY(v)}
            stroke="#3f3f46" strokeWidth="1"
          />
        ))}

        {/* Reference lines at v=0 and v=1 (slightly bolder) */}
        <line x1={PAD_L} y1={svgY(0)} x2={PAD_L + INNER_W} y2={svgY(0)} stroke="#52525b" strokeWidth="1" />
        <line x1={PAD_L} y1={svgY(1)} x2={PAD_L + INNER_W} y2={svgY(1)} stroke="#52525b" strokeWidth="1" />

        {/* Easing curve */}
        {mode === 'preset' ? (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d={customPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
        )}

        {/* Anchor dots at P0 and P3 */}
        <circle cx={p0x} cy={p0y} r="4" fill="#6366f1" />
        <circle cx={p3x} cy={p3y} r="4" fill="#6366f1" />

        {/* Guide lines + draggable handles — always visible */}
        <line
          x1={p0x} y1={p0y} x2={cp1x} y2={cp1y}
          stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2"
          opacity={mode === 'custom' ? 1 : 0.45}
        />
        <line
          x1={p3x} y1={p3y} x2={cp2x} y2={cp2y}
          stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2"
          opacity={mode === 'custom' ? 1 : 0.45}
        />
        <circle
          cx={cp1x} cy={cp1y} r="6"
          fill={mode === 'custom' ? '#4f46e5' : '#312e81'} stroke="#a5b4fc" strokeWidth="1.5"
          opacity={mode === 'custom' ? 1 : 0.45}
          style={{ cursor: 'grab' }}
          onMouseDown={e => startDrag(e, 'p1')}
        />
        <circle
          cx={cp2x} cy={cp2y} r="6"
          fill={mode === 'custom' ? '#4f46e5' : '#312e81'} stroke="#a5b4fc" strokeWidth="1.5"
          opacity={mode === 'custom' ? 1 : 0.45}
          style={{ cursor: 'grab' }}
          onMouseDown={e => startDrag(e, 'p2')}
        />
      </svg>

      {/* Preset dropdown */}
      {mode === 'preset' && (
        <div className="relative">
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full appearance-none bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer pr-7"
          >
            {EASING_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-zinc-400 text-xs">
            ▾
          </div>
        </div>
      )}

      {/* Custom mode: readout */}
      {mode === 'custom' && (
        <div className="text-xs font-mono text-zinc-400 truncate px-1">
          {value}
        </div>
      )}
    </div>
  );
}
