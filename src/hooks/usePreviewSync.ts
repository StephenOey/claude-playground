import { useEffect, type RefObject } from 'react';

export function usePreviewSync(
  code: string,
  iframeRef: RefObject<HTMLIFrameElement | null>
) {
  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'GSAP_UPDATE', code }, '*');
  }, [code, iframeRef]);
}
