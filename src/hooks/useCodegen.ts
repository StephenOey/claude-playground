import { useMemo } from 'react';
import { useAnimationStore } from '../store/animationStore';
import { generateCode, generateAllCode } from '../codegen';

export function useCodegen() {
  const animations = useAnimationStore(s => s.animations);
  const activeId   = useAnimationStore(s => s.activeId);

  const activeConfig = animations.find(a => a.id === activeId);

  const activeCode = useMemo(
    () => (activeConfig ? generateCode(activeConfig) : ''),
    [activeConfig]
  );

  const allCode = useMemo(
    () => generateAllCode(animations),
    [animations]
  );

  const jsonOutput = useMemo(
    () => JSON.stringify(animations, null, 2),
    [animations]
  );

  return { activeCode, allCode, jsonOutput };
}
