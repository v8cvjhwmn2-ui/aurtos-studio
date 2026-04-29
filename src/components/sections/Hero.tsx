'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Search, Code2 } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { trackCtaClick } from '@/lib/analytics';

export function Hero() {
  return (
    <section className="relative flex min-h-[680px] items-center overflow-hidden pb-16 pt-28 sm:min-h-[760px] lg:min-h-screen lg:pb-0 lg:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 grain-overlay">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FB923C]/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <h1 className="font-[family-name:var(--font-heading)] mb-6">
              We build brands that{' '}
              <span className="gradient-text">scale</span>, websites that{' '}
              <span className="gradient-text">convert</span>, and ads that{' '}
              <span className="gradient-text">print money</span>.
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted lg:mx-0">
              Aurtos Studio is a full-stack digital agency helping startups, D2C brands, and
              businesses grow online — from logo to launch to leads.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/contact"
                onClick={() => trackCtaClick('Get Free Consultation', 'hero')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-105"
                id="hero-cta-primary"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portfolio"
                onClick={() => trackCtaClick('View Our Work', 'hero')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-foreground border border-border-custom rounded-full hover:border-primary hover:text-primary transition-all duration-300"
                id="hero-cta-secondary"
              >
                View Our Work
              </Link>
            </div>
          </div>

          {/* Right: Floating Cards */}
          <div className="hidden lg:block relative">
            <div className="relative w-full h-[500px]">
              {[
                { label: 'Meta Ads', value: '3x ROAS', sub: 'Last 30 days', icon: TrendingUp, color: 'from-primary to-primary-glow', delay: 0 },
                { label: 'SEO Growth', value: '10K+ Visits', sub: 'Organic / month', icon: Search, color: 'from-secondary to-pink-300', delay: 0.2 },
                { label: 'Websites', value: '100+ Sites', sub: 'Shipped & live', icon: Code2, color: 'from-[#FB923C] to-amber-300', delay: 0.4 },
              ].map((card, i) => (
                <div
                  key={card.label}
                  className="absolute glass-card p-5 w-60 animate-float cursor-default transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.03]"
                  style={{
                    top: `${i * 140 + 20}px`,
                    left: `${i * 60 + 40}px`,
                    animationDelay: `${card.delay}s`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <card.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">{card.label}</p>
                      <p className="text-[10px] text-muted/70">{card.sub}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold font-[family-name:var(--font-heading)] gradient-text">{card.value}</p>
                  <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${card.color}`} style={{ width: `${70 + i * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
