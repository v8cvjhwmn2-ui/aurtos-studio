'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'aurtos-cookie-consent-v1';
type Consent = 'all' | 'essential' | null;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function pushConsent(value: Exclude<Consent, null>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cookie_consent_update',
    consent: value,
  });
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Consent;
      if (!stored) {
        const t = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, []);

  const handle = (value: Exclude<Consent, null>) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    pushConsent(value);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-[80]"
        >
          <div className="glass-card p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <Cookie className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  We use cookies
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  We use essential cookies to make this site work and analytics
                  cookies to improve it. Read our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <button
                onClick={() => handle('essential')}
                className="text-muted hover:text-foreground transition-colors -mt-1 -mr-1 p-1"
                aria-label="Dismiss with essential cookies only"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
              <button
                onClick={() => handle('essential')}
                className="flex-1 px-4 py-2 text-xs font-semibold text-foreground border border-border-custom rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                Essential only
              </button>
              <button
                onClick={() => handle('all')}
                className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-colors"
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
