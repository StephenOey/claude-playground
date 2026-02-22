import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step, unit, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-200 font-mono">
          {value}{unit ?? ''}
        </span>
      </div>
      <RadixSlider.Root
        className="relative flex items-center w-full h-5 cursor-pointer"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <RadixSlider.Track className="relative h-1 grow rounded-full bg-zinc-700">
          <RadixSlider.Range className="absolute h-full rounded-full bg-indigo-500" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block w-4 h-4 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </RadixSlider.Root>
    </div>
  );
}
