'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { trackCtaClick } from '@/lib/analytics';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 grain-overlay">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FB923C]/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
            >
              <span className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="text-sm font-medium text-muted">
                Trusted by <span className="text-foreground font-semibold">50+ brands</span> across India
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-[family-name:var(--font-heading)] mb-6"
            >
              We build brands that{' '}
              <span className="gradient-text">scale</span>, websites that{' '}
              <span className="gradient-text">convert</span>, and ads that{' '}
              <span className="gradient-text">print money</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted mb-8 max-w-xl leading-relaxed"
            >
              Aurtos Studio is a full-stack digital agency helping startups, D2C brands, and
              businesses grow online — from logo to launch to leads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/contact"
                onClick={() => trackCtaClick('Get Free Consultation', 'hero')}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-105"
                id="hero-cta-primary"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                onClick={() => trackCtaClick('View Our Work', 'hero')}
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-foreground border border-border-custom rounded-full hover:border-primary hover:text-primary transition-all duration-300"
                id="hero-cta-secondary"
              >
                View Our Work
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-sm text-muted"
            >
              Trusted by <span className="text-foreground font-semibold">50+ brands</span> across India
            </motion.p>
          </div>

          {/* Right: Floating Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {[
                { label: 'Meta Ads', value: '3x ROAS', color: 'from-primary to-primary-glow', delay: 0 },
                { label: 'SEO Growth', value: '10K+ Visits', color: 'from-secondary to-pink-300', delay: 0.2 },
                { label: 'Web Dev', value: '100+ Sites', color: 'from-[#FB923C] to-amber-300', delay: 0.4 },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 40, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 + card.delay }}
                  className="absolute glass-card p-6 w-56 animate-float"
                  style={{
                    top: `${i * 140 + 20}px`,
                    left: `${i * 60 + 40}px`,
                    animationDelay: `${card.delay}s`,
                  }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} mb-3 flex items-center justify-center`}>
                    <span className="text-white text-lg font-bold">{card.label.charAt(0)}</span>
                  </div>
                  <p className="text-xs text-muted mb-1">{card.label}</p>
                  <p className="text-xl font-bold font-[family-name:var(--font-heading)]">{card.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
