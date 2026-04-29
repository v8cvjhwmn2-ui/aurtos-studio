'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          appearance?: 'always' | 'execute' | 'interaction-only';
        },
      ) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_ID = 'cf-turnstile-script';
/** Token sent in dev when localhost isn't on the Cloudflare allowlist.
 *  The server accepts this only when host=localhost OR NODE_ENV!=='production'. */
export const DEV_BYPASS_TOKEN = 'dev-bypass-localhost';

function isLocalhost() {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local');
}

export function TurnstileWidget({
  onToken,
  onError,
}: {
  onToken: (token: string) => void;
  onError?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [bypassed, setBypassed] = useState(false);

  // Dev bypass — Turnstile widgets reject localhost unless explicitly allowlisted.
  // Skip widget render and emit a sentinel token so form is submittable locally.
  useEffect(() => {
    if (isLocalhost()) {
      setBypassed(true);
      onToken(DEV_BYPASS_TOKEN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bypassed) return;
    if (!siteKey || !containerRef.current) return;

    const render = () => {
      if (!window.turnstile || !containerRef.current) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: onToken,
        'error-callback': () => onError?.(),
        'expired-callback': () => onError?.(),
      });
    };

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit';
      script.async = true;
      script.defer = true;
      window.onloadTurnstileCallback = render;
      document.head.appendChild(script);
    } else {
      const t = setInterval(() => {
        if (window.turnstile) {
          clearInterval(t);
          render();
        }
      }, 100);
      return () => clearInterval(t);
    }

    const id = widgetIdRef.current;
    return () => {
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, bypassed]);

  if (bypassed) {
    return (
      <p className="text-[11px] text-muted/60">
        Anti-spam check skipped on localhost (production: full Turnstile enforced)
      </p>
    );
  }

  if (!siteKey) {
    return (
      <p className="text-xs text-muted">
        (Turnstile site key not configured — anti-spam disabled)
      </p>
    );
  }

  return <div ref={containerRef} className="cf-turnstile" />;
}
