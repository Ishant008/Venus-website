const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let scriptLoadPromise = null;

function loadScript() {
  if (!SITE_KEY) return Promise.resolve(false);
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve) => {
    if (window.grecaptcha) return resolve(true);
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Returns a reCAPTCHA v3 token for the given action, or null when
 * VITE_RECAPTCHA_SITE_KEY isn't configured — callers should treat a null
 * token as "reCAPTCHA disabled" and submit normally (the backend middleware
 * is equally a no-op when its secret key isn't set).
 */
export async function getRecaptchaToken(action = 'submit') {
  if (!SITE_KEY) return null;
  const loaded = await loadScript();
  if (!loaded || !window.grecaptcha) return null;

  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action }).then(resolve).catch(() => resolve(null));
    });
  });
}