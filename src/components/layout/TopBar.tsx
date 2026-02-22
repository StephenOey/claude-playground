import { useAnimationStore } from '../../store/animationStore';
import { Button } from '../ui/Button';

export function TopBar() {
  const exportAll = useAnimationStore(s => s.exportAll);
  const animCount = useAnimationStore(s => s.animations.length);

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-sm tracking-tight">AnimCraft</span>
        <span className="text-zinc-600 text-xs">GSAP Animation Builder</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={exportAll}
        disabled={animCount === 0}
      >
        Export JSON
      </Button>
    </header>
  );
}
