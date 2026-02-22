import { useAnimationStore } from '../../store/animationStore';
import type { ScrollAnimation, TweenVars, ScrollTriggerConfig } from '../../types/animation';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { EasingEditor } from '../ui/EasingEditor';

interface Props {
  anim: ScrollAnimation;
}

const TOGGLE_ACTIONS_OPTIONS = [
  { value: 'play none none none',    label: 'Play once' },
  { value: 'play none none reverse', label: 'Play / Reverse' },
  { value: 'play pause resume reset', label: 'Play / Pause / Resume / Reset' },
  { value: 'restart none none none', label: 'Restart each time' },
];

function TweenVarSection({
  title,
  vars,
  onUpdate,
}: {
  title: string;
  vars: TweenVars;
  onUpdate: (patch: Partial<TweenVars>) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</h4>
      <Slider label="Opacity" value={vars.opacity ?? 1} min={0} max={1} step={0.01} onChange={v => onUpdate({ opacity: v })} />
      <Slider label="Translate Y" value={vars.y ?? 0} min={-200} max={200} step={1} unit="px" onChange={v => onUpdate({ y: v })} />
      <Slider label="Translate X" value={vars.x ?? 0} min={-200} max={200} step={1} unit="px" onChange={v => onUpdate({ x: v })} />
      <Slider label="Scale" value={vars.scale ?? 1} min={0} max={3} step={0.01} onChange={v => onUpdate({ scale: v })} />
      <Slider label="Rotation" value={vars.rotation ?? 0} min={-360} max={360} step={1} unit="°" onChange={v => onUpdate({ rotation: v })} />
    </div>
  );
}

export function ScrollConfigurator({ anim }: Props) {
  const updateAnimation = useAnimationStore(s => s.updateAnimation);

  function updateTrigger(patch: Partial<ScrollTriggerConfig>) {
    updateAnimation(anim.id, { trigger: { ...anim.trigger, ...patch } });
  }

  function updateTween(patch: Partial<typeof anim.tween>) {
    updateAnimation(anim.id, { tween: { ...anim.tween, ...patch } });
  }

  function updateFrom(patch: Partial<TweenVars>) {
    updateTween({ from: { ...anim.tween.from, ...patch } });
  }

  function updateTo(patch: Partial<TweenVars>) {
    updateTween({ to: { ...anim.tween.to, ...patch } });
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

      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">ScrollTrigger</h4>
      <div>
        <label className="text-xs text-zinc-400 block mb-1">Start</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.trigger.start}
          onChange={e => updateTrigger({ start: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-400 block mb-1">End</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.trigger.end}
          onChange={e => updateTrigger({ end: e.target.value })}
        />
      </div>
      <Select
        label="Toggle Actions"
        value={anim.trigger.toggleActions}
        options={TOGGLE_ACTIONS_OPTIONS}
        onChange={v => updateTrigger({ toggleActions: v })}
      />
      <Toggle label="Scrub" checked={!!anim.trigger.scrub} onChange={v => updateTrigger({ scrub: v })} />
      <Toggle label="Pin" checked={anim.trigger.pin} onChange={v => updateTrigger({ pin: v })} />

      <div className="h-px bg-zinc-800" />

      <Slider label="Duration" value={anim.tween.duration} min={0.1} max={5} step={0.1} unit="s" onChange={v => updateTween({ duration: v })} />
      <EasingEditor label="Ease" value={anim.tween.ease} onChange={v => updateTween({ ease: v })} />
      <Slider label="Stagger" value={anim.tween.stagger ?? 0} min={0} max={0.5} step={0.01} unit="s" onChange={v => updateTween({ stagger: v || undefined })} />

      <div className="h-px bg-zinc-800" />
      <TweenVarSection title="From (start state)" vars={anim.tween.from} onUpdate={updateFrom} />
      <div className="h-px bg-zinc-800" />
      <TweenVarSection title="To (end state)" vars={anim.tween.to} onUpdate={updateTo} />
    </div>
  );
}
