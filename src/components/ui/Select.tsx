import * as RadixSelect from '@radix-ui/react-select';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-zinc-400">{label}</span>
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          className={clsx(
            'flex items-center justify-between px-2.5 py-1.5 text-sm rounded',
            'bg-zinc-800 border border-zinc-700 text-zinc-200',
            'hover:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
            'cursor-pointer'
          )}
        >
          <RadixSelect.Value />
          <RadixSelect.Icon className="text-zinc-400 ml-2">▾</RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 bg-zinc-800 border border-zinc-700 rounded shadow-xl overflow-hidden"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="max-h-60 overflow-y-auto p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={clsx(
                    'flex items-center px-2.5 py-1.5 text-sm rounded cursor-pointer',
                    'text-zinc-300 hover:bg-zinc-700 hover:text-white',
                    'focus:outline-none focus:bg-zinc-700 focus:text-white',
                    'data-[state=checked]:text-indigo-400'
                  )}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
