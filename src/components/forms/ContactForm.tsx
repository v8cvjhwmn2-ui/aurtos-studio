'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, CheckCircle, MessageCircle, AlertTriangle } from 'lucide-react';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { trackFormStart, trackFormSubmit } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { TurnstileWidget } from './Turnstile';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  preselectedService?: string;
  className?: string;
}

export function ContactForm({ preselectedService, className }: ContactFormProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [website, setWebsite] = useState(''); // honeypot

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: preselectedService || '',
    },
  });

  const onFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackFormStart('contact');
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken, website }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || 'Submission failed');
      }
      trackFormSubmit('contact');
      setIsSubmitted(true);
      // Fire conversion + redirect to thank-you for tracking
      setTimeout(() => router.push('/thank-you'), 800);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please WhatsApp us.',
      );
    }
  };

  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I'm interested in your services. Can we discuss?",
  )}`;

  if (isSubmitted) {
    return (
      <div className={cn('glass-card p-8 text-center', className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-2">
          Thank you! We&apos;ll be in touch soon.
        </h3>
        <p className="text-muted text-sm mb-6">
          Our team typically responds within 2 hours during business hours (9am–9pm IST).
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Or chat on WhatsApp for faster response
        </a>
      </div>
    );
  }

  const inputClasses =
    'w-full px-4 py-3 bg-surface-elevated border border-border-custom rounded-xl text-foreground text-sm placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={onFocus}
      className={cn('glass-card p-6 md:p-8 space-y-5', className)}
      id="contact-form"
      noValidate
    >
      {/* Honeypot — hidden from real users, attractive to bots */}
      <div aria-hidden className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
            Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            className={inputClasses}
            autoComplete="name"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email *
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            className={inputClasses}
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">+91</span>
            <input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className={cn(inputClasses, 'pl-12')}
              autoComplete="tel"
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
            Company
          </label>
          <input
            id="company"
            type="text"
            placeholder="Your company name"
            className={inputClasses}
            autoComplete="organization"
            {...register('company')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-foreground mb-1.5">
            Service Interested In *
          </label>
          <select
            id="service"
            className={cn(inputClasses, 'appearance-none cursor-pointer')}
            {...register('service')}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-xs text-red-400">{errors.service.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-1.5">
            Budget Range
          </label>
          <select
            id="budget"
            className={cn(inputClasses, 'appearance-none cursor-pointer')}
            {...register('budget')}
          >
            <option value="">Select budget</option>
            <option value="10k-25k">₹10,000 – ₹25,000</option>
            <option value="25k-1l">₹25,000 – ₹1,00,000</option>
            <option value="1l-5l">₹1,00,000 – ₹5,00,000</option>
            <option value="5l+">₹5,00,000+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Tell us about your project *
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="What are you looking to build? Any specific goals or timelines?"
          className={cn(inputClasses, 'resize-none')}
          {...register('message')}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <TurnstileWidget onToken={setTurnstileToken} onError={() => setTurnstileToken('')} />

      {serverError && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        id="contact-submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted">
        We typically respond within 2 hours during business hours.
      </p>
    </form>
  );
}
