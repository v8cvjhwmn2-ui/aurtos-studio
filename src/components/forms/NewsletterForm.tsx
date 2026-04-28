'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { trackFormStart, trackFormSubmit } from '@/lib/analytics';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    trackFormStart('newsletter');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    trackFormSubmit('newsletter');
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center gap-2 text-success text-sm">
        <CheckCircle className="w-4 h-4" />
        Thanks! You&apos;re on the list.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" id="newsletter-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 px-4 py-2.5 bg-surface-elevated border border-border-custom rounded-xl text-foreground text-sm placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-glow transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
