import { useRef } from 'react';
import { usePreviewSync } from '../../hooks/usePreviewSync';

interface Props {
  code: string;
  animType?: string;
}

export function PreviewPanel({ code, animType }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  usePreviewSync(code, iframeRef);

  function sendCarouselMessage(msgType: 'CAROUSEL_PREV' | 'CAROUSEL_NEXT') {
    iframeRef.current?.contentWindow?.postMessage({ type: msgType }, '*');
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-3 py-2 border-b border-zinc-800 shrink-0">
        <span className="text-xs text-zinc-400">Live Preview</span>
        {animType === 'carousel' && !!code && (
          <div className="ml-auto flex gap-1.5">
            <button
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              onClick={() => sendCarouselMessage('CAROUSEL_PREV')}
            >
              ← Prev
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              onClick={() => sendCarouselMessage('CAROUSEL_NEXT')}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 relative overflow-hidden">
        {code ? (
          <iframe
            ref={iframeRef}
            src="/preview-frame.html"
            className="w-full h-full border-0"
            title="Animation Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
            Select an animation to preview it
          </div>
        )}
      </div>
    </div>
  );
}
