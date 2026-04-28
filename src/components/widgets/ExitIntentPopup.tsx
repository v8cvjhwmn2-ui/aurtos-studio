'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { trackCtaClick } from '@/lib/analytics';

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem('exitPopupShown')) {
      setIsOpen(true);
      sessionStorage.setItem('exitPopupShown', 'true');
    }
  }, []);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-md glass-card p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-2">
              Wait! Don&apos;t go yet.
            </h3>
            <p className="text-muted text-sm mb-6">
              Get a <span className="text-primary font-semibold">free 30-minute consultation</span> with our growth experts. No commitment, no pressure — just honest advice for your business.
            </p>

            <Link
              href="/contact"
              onClick={() => {
                trackCtaClick('Free Consultation', 'exit-intent-popup');
                setIsOpen(false);
              }}
              className="inline-flex items-center px-8 py-3 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              Book Free Consultation
            </Link>
            <p className="mt-3 text-xs text-muted">
              We reply within 2 hours ⚡
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
