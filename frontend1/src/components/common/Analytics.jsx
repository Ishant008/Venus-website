import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let gaLoaded = false;
let clarityLoaded = false;

function loadGA() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line no-inner-declarations
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false }); // we send page_view manually on route change
}

function loadClarity() {
  if (clarityLoaded || !CLARITY_ID) return;
  clarityLoaded = true;

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', CLARITY_ID);
}

/**
 * Mounted once near the app root. Loads Google Analytics 4 and Microsoft
 * Clarity only when their env vars are set (VITE_GA_MEASUREMENT_ID /
 * VITE_CLARITY_PROJECT_ID) — safe no-op otherwise — and sends a GA4
 * page_view on every route change (since this is a client-rendered SPA,
 * GA's automatic page_view on load only catches the first page).
 */
export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    loadGA();
    loadClarity();
  }, []);

  useEffect(() => {
    if (window.gtag && GA_ID) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }
  }, [location]);

  return null;
}