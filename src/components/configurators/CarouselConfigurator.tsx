import { useAnimationStore } from '../../store/animationStore';
import type { CarouselAnimation, CarouselTransition } from '../../types/animation';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { EasingEditor } from '../ui/EasingEditor';

interface Props {
  anim: CarouselAnimation;
}

const TRANSITION_OPTIONS = [
  { value: 'slide', label: 'Slide' },
  { value: 'fade',  label: 'Fade' },
  { value: 'flip',  label: 'Flip' },
];

export function CarouselConfigurator({ anim }: Props) {
  const updateAnimation = useAnimationStore(s => s.updateAnimation);
  const update = (patch: Partial<CarouselAnimation>) => updateAnimation(anim.id, patch);

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <div>
        <label className="text-xs text-zinc-400 block mb-1">Label</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.label}
          onChange={e => update({ label: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-400 block mb-1">Carousel Selector</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.targetSelector}
          onChange={e => update({ targetSelector: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-zinc-400 block mb-1">Item Selector</label>
        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-sm text-zinc-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={anim.itemSelector}
          onChange={e => update({ itemSelector: e.target.value })}
        />
      </div>

      <div className="h-px bg-zinc-800" />

      <Select
        label="Transition Type"
        value={anim.transitionType}
        options={TRANSITION_OPTIONS}
        onChange={v => update({ transitionType: v as CarouselTransition })}
      />
      <EasingEditor label="Ease" value={anim.ease} onChange={v => update({ ease: v })} />
      <Slider label="Duration" value={anim.duration} min={0.1} max={3} step={0.05} unit="s" onChange={v => update({ duration: v })} />
      <Slider label="Visible Items" value={anim.visibleItems} min={1} max={5} step={1} onChange={v => update({ visibleItems: v })} />

      <div className="h-px bg-zinc-800" />

      <Toggle label="Loop" checked={anim.loop} onChange={v => update({ loop: v })} />
      <Toggle label="Drag Enabled" checked={anim.dragEnabled} onChange={v => update({ dragEnabled: v })} />
      <Toggle label="Autoplay" checked={anim.autoplay} onChange={v => update({ autoplay: v })} />
      {anim.autoplay && (
        <Slider label="Autoplay Delay" value={anim.autoplayDelay} min={0.5} max={10} step={0.5} unit="s" onChange={v => update({ autoplayDelay: v })} />
      )}
    </div>
  );
}
