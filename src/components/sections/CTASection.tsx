'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { site } from '@/data/site';
import { trackCtaClick, trackWhatsAppClick, trackPhoneClick } from '@/lib/analytics';

export function CTASection() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I'm interested in your services."
  )}`;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 grain-overlay" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-[family-name:var(--font-heading)] mb-4">
            Ready to <span className="gradient-text">grow your brand</span>?
          </h2>
          <p className="text-muted text-lg mb-8">
            Let&apos;s talk about your goals and build a plan to get there. No fluff, just results.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              onClick={() => trackCtaClick('Get Started', 'cta-section')}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-105"
              id="cta-section-primary"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('cta-section')}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-[#25D366] rounded-full hover:bg-[#20bd5a] transition-all duration-300"
              id="cta-section-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
            <a
              href={`tel:${site.phone}`}
              onClick={() => trackPhoneClick('cta-section')}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-foreground border border-border-custom rounded-full hover:border-primary hover:text-primary transition-all duration-300"
              id="cta-section-call"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
