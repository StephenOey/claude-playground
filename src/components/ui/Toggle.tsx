import * as RadixSwitch from '@radix-ui/react-switch';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-400">{label}</span>
      <RadixSwitch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="w-9 h-5 rounded-full bg-zinc-700 data-[state=checked]:bg-indigo-600 transition-colors cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <RadixSwitch.Thumb className="block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
      </RadixSwitch.Root>
    </div>
  );
}
