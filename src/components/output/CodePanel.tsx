import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useClipboard } from '../../hooks/useClipboard';
import { Button } from '../ui/Button';

interface Props {
  code: string;
}

export function CodePanel({ code }: Props) {
  const { copied, copy } = useClipboard();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 shrink-0">
        <span className="text-xs text-zinc-400">Generated GSAP Code</span>
        <Button size="sm" variant="ghost" onClick={() => copy(code)} disabled={!code}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="flex-1 overflow-auto text-sm">
        {code ? (
          <CodeMirror
            value={code}
            extensions={[javascript()]}
            theme={oneDark}
            editable={false}
            basicSetup={{ lineNumbers: true, foldGutter: false }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            Select an animation to see generated code
          </div>
        )}
      </div>
    </div>
  );
}
