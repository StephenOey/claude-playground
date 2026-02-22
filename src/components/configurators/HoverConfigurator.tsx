import { useAnimationStore } from '../../store/animationStore';
import type { HoverAnimation, HoverState } from '../../types/animation';
import { Slider } from '../ui/Slider';
import { EasingEditor } from '../ui/EasingEditor';

interface Props {
  anim: HoverAnimation;
}

type StateKey = 'enter' | 'leave';

function HoverStateSection({
  title,
  state,
  onUpdate,
}: {
  title: string;
  state: HoverState;
  onUpdate: (patch: Partial<HoverState>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</h4>
      <Slider label="Duration" value={state.duration} min={0.05} max={2} step={0.05} unit="s" onChange={v => onUpdate({ duration: v })} />
      <EasingEditor label="Ease" value={state.ease} onChange={v => onUpdate({ ease: v })} />
      <Slider label="Scale" value={state.scale ?? 1} min={0.5} max={2} step={0.01} onChange={v => onUpdate({ scale: v })} />
      <Slider label="Translate Y" value={state.y ?? 0} min={-80} max={80} step={1} unit="px" onChange={v => onUpdate({ y: v })} />
      <Slider label="Translate X" value={state.x ?? 0} min={-80} max={80} step={1} unit="px" onChange={v => onUpdate({ x: v })} />
      <Slider label="Opacity" value={state.opacity ?? 1} min={0} max={1} step={0.01} onChange={v => onUpdate({ opacity: v })} />
      <Slider label="Rotation" value={state.rotation ?? 0} min={-360} max={360} step={1} unit="°" onChange={v => onUpdate({ rotation: v })} />
    </div>
  );
}

export function HoverConfigurator({ anim }: Props) {
  const updateAnimation = useAnimationStore(s => s.updateAnimation);

  function updateState(key: StateKey, patch: Partial<HoverState>) {
    updateAnimation(anim.id, { [key]: { ...anim[key], ...patch } });
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <div>
        <label className="text-xs text-zinc-400 block mb-1">Label</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.label}
          onChange={e => updateAnimation(anim.id, { label: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-400 block mb-1">CSS Selector</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.targetSelector}
          onChange={e => updateAnimation(anim.id, { targetSelector: e.target.value })}
        />
      </div>
      <div className="h-px bg-zinc-800" />
      <HoverStateSection title="On Enter (mouseenter)" state={anim.enter} onUpdate={p => updateState('enter', p)} />
      <div className="h-px bg-zinc-800" />
      <HoverStateSection title="On Leave (mouseleave)" state={anim.leave} onUpdate={p => updateState('leave', p)} />
    </div>
  );
}
