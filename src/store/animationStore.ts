import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { AnimationConfig, AnimationType } from '../types/animation';
import { defaultHover, defaultCarousel, defaultScroll } from '../utils/defaults';

interface AnimationStore {
  animations: AnimationConfig[];
  activeId: string | null;

  addAnimation: (type: AnimationType) => void;
  removeAnimation: (id: string) => void;
  updateAnimation: (id: string, patch: Partial<AnimationConfig>) => void;
  setActiveId: (id: string | null) => void;
  exportAll: () => void;
}

function createDefault(type: AnimationType): AnimationConfig {
  switch (type) {
    case 'hover':    return defaultHover();
    case 'carousel': return defaultCarousel();
    case 'scroll':   return defaultScroll();
  }
}

export const useAnimationStore = create<AnimationStore>()(
  immer((set, get) => ({
    animations: [],
    activeId: null,

    addAnimation(type) {
      const next = createDefault(type);
      set(state => {
        state.animations.push(next);
        state.activeId = next.id;
      });
    },

    removeAnimation(id) {
      set(state => {
        const idx = state.animations.findIndex(a => a.id === id);
        if (idx === -1) return;
        state.animations.splice(idx, 1);
        if (state.activeId === id) {
          state.activeId = state.animations.length > 0 ? state.animations[0].id : null;
        }
      });
    },

    updateAnimation(id, patch) {
      set(state => {
        const anim = state.animations.find(a => a.id === id);
        if (!anim) return;
        Object.assign(anim, patch);
      });
    },

    setActiveId(id) {
      set(state => { state.activeId = id; });
    },

    exportAll() {
      const { animations } = get();
      const payload = JSON.stringify(
        { version: '1.0', exportedAt: new Date().toISOString(), animations },
        null,
        2
      );
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animations.json';
      a.click();
      URL.revokeObjectURL(url);
    },
  }))
);
