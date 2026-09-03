import { useEffect, useRef } from 'react';

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID;

let scriptPromise = null;
function loadAdSenseScript() {
  if (!CLIENT_ID) return Promise.resolve(false);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    if (window.adsbygoogle) return resolve(true);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders a single Google AdSense ad unit. Intentionally loaded on-demand
 * (only when this component mounts) rather than sitewide — so ads only
 * ever appear on pages that explicitly render <AdSlot />, e.g. the News
 * article page. Renders nothing until VITE_ADSENSE_CLIENT_ID and a slot
 * ID are both provided, so it's a safe no-op before AdSense approval.
 */
export default function AdSlot({ slot, format = 'auto', label = 'Advertisement' }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || !slot) return;
    loadAdSenseScript().then((ok) => {
      if (!ok || pushed.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense sometimes throws if called before the script is fully ready — safe to ignore
      }
    });
  }, [slot]);

  if (!CLIENT_ID || !slot) return null;

  return (
    <div className="my-8">
      <p className="mb-1.5 text-center text-[10px] uppercase tracking-wide text-ink-muted">{label}</p>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}