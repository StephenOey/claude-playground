import { useAnimationStore } from '../../store/animationStore';
import type { AnimationType, AnimationConfig } from '../../types/animation';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

const ADD_OPTIONS: { type: AnimationType; label: string; icon: string }[] = [
  { type: 'hover',    label: 'Hover',    icon: '⊹' },
  { type: 'carousel', label: 'Carousel', icon: '⟳' },
  { type: 'scroll',   label: 'Scroll',   icon: '↕' },
];

function typeTag(type: AnimationType) {
  return {
    hover:    { label: 'Hover',    color: 'bg-sky-900/50 text-sky-400' },
    carousel: { label: 'Carousel', color: 'bg-violet-900/50 text-violet-400' },
    scroll:   { label: 'Scroll',   color: 'bg-emerald-900/50 text-emerald-400' },
  }[type];
}

interface AnimItemProps {
  anim: AnimationConfig;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function AnimItem({ anim, isActive, onSelect, onRemove }: AnimItemProps) {
  const tag = typeTag(anim.type);
  return (
    <div
      onClick={onSelect}
      className={clsx(
        'group flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors',
        isActive ? 'bg-zinc-700' : 'hover:bg-zinc-800'
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm text-zinc-100 truncate">{anim.label}</span>
        <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded w-fit', tag.color)}>
          {tag.label}
        </span>
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={e => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 ml-2 shrink-0"
      >
        ✕
      </Button>
    </div>
  );
}

export function Sidebar() {
  const animations = useAnimationStore(s => s.animations);
  const activeId   = useAnimationStore(s => s.activeId);
  const add        = useAnimationStore(s => s.addAnimation);
  const remove     = useAnimationStore(s => s.removeAnimation);
  const setActive  = useAnimationStore(s => s.setActiveId);

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
      {/* Add buttons */}
      <div className="p-3 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Add Animation</p>
        <div className="flex flex-col gap-1">
          {ADD_OPTIONS.map(opt => (
            <Button
              key={opt.type}
              variant="ghost"
              size="sm"
              onClick={() => add(opt.type)}
              className="justify-start"
            >
              <span className="mr-2 text-base">{opt.icon}</span>
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Animation list */}
      <div className="flex-1 overflow-y-auto p-2">
        {animations.length === 0 ? (
          <p className="text-xs text-zinc-600 text-center mt-6 px-2">
            Add an animation above to get started
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {animations.map(anim => (
              <AnimItem
                key={anim.id}
                anim={anim}
                isActive={anim.id === activeId}
                onSelect={() => setActive(anim.id)}
                onRemove={() => remove(anim.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
