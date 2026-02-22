import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { useClipboard } from '../../hooks/useClipboard';
import { Button } from '../ui/Button';

interface Props {
  jsonOutput: string;
}

export function JsonPanel({ jsonOutput }: Props) {
  const { copied, copy } = useClipboard();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 shrink-0">
        <span className="text-xs text-zinc-400">JSON Config</span>
        <Button size="sm" variant="ghost" onClick={() => copy(jsonOutput)} disabled={!jsonOutput || jsonOutput === '[]'}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="flex-1 overflow-auto text-sm">
        {jsonOutput && jsonOutput !== '[]' ? (
          <CodeMirror
            value={jsonOutput}
            extensions={[json()]}
            theme={oneDark}
            editable={false}
            basicSetup={{ lineNumbers: true, foldGutter: true }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            Add animations to see the JSON config
          </div>
        )}
      </div>
    </div>
  );
}
