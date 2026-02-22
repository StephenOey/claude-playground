import * as Tabs from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import { useAnimationStore } from '../../store/animationStore';
import { useUIStore } from '../../store/uiStore';
import { useCodegen } from '../../hooks/useCodegen';
import { PreviewPanel } from '../preview/PreviewPanel';
import { CodePanel } from '../output/CodePanel';
import { JsonPanel } from '../output/JsonPanel';
import { HoverConfigurator } from '../configurators/HoverConfigurator';
import { CarouselConfigurator } from '../configurators/CarouselConfigurator';
import { ScrollConfigurator } from '../configurators/ScrollConfigurator';
import type { AnimationConfig } from '../../types/animation';

const TAB_ITEMS = [
  { value: 'preview', label: 'Preview' },
  { value: 'code',    label: 'JS Code' },
  { value: 'json',    label: 'JSON' },
] as const;

function ConfiguratorPanel({ anim }: { anim: AnimationConfig | undefined }) {
  if (!anim) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
        Select an animation to configure it
      </div>
    );
  }
  switch (anim.type) {
    case 'hover':    return <HoverConfigurator anim={anim} />;
    case 'carousel': return <CarouselConfigurator anim={anim} />;
    case 'scroll':   return <ScrollConfigurator anim={anim} />;
  }
}

export function MainPanel() {
  const { activeTab, setActiveTab } = useUIStore();
  const animations = useAnimationStore(s => s.animations);
  const activeId   = useAnimationStore(s => s.activeId);
  const activeAnim = animations.find(a => a.id === activeId);

  const { activeCode, jsonOutput } = useCodegen();

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      {/* Output area — left side */}
      <Tabs.Root
        value={activeTab}
        onValueChange={v => setActiveTab(v as typeof activeTab)}
        className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden"
      >
        <Tabs.List className="flex shrink-0 border-b border-zinc-800 px-3 gap-1">
          {TAB_ITEMS.map(tab => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={clsx(
                'px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
                'border-transparent text-zinc-500 hover:text-zinc-300',
                'data-[state=active]:border-indigo-500 data-[state=active]:text-white'
              )}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="preview" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <PreviewPanel code={activeCode} animType={activeAnim?.type} />
        </Tabs.Content>
        <Tabs.Content value="code" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <CodePanel code={activeCode} />
        </Tabs.Content>
        <Tabs.Content value="json" className="flex-1 min-h-0 overflow-hidden data-[state=inactive]:hidden">
          <JsonPanel jsonOutput={jsonOutput} />
        </Tabs.Content>
      </Tabs.Root>

      {/* Configurator — right side */}
      <div className="w-80 shrink-0 flex flex-col border-l border-zinc-800 overflow-hidden">
        <div className="shrink-0 border-b border-zinc-800 flex items-center px-3 py-2">
          <span className="text-xs text-zinc-400">
            {activeAnim ? `Configuring: ${activeAnim.label}` : 'Configuration'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConfiguratorPanel anim={activeAnim} />
        </div>
      </div>
    </div>
  );
}
