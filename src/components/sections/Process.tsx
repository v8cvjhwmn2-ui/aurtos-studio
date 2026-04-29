'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discover',
    description: 'We deep-dive into your business, audience, and competitors to find growth opportunities.',
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Strategize',
    description: 'Build a data-driven roadmap with clear KPIs, timelines, and deliverables.',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Execute',
    description: 'Our team ships fast — pixel-perfect designs, clean code, and optimized campaigns.',
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Scale',
    description: 'Monitor, optimize, and scale what works. We double down on winners.',
  },
];

export function Process() {
  return (
    <Section variant="surface">
      <Container>
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary uppercase tracking-widest mb-3"
          >
            Our Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)]"
          >
            From idea to <span className="gradient-text">impact</span> in 4 steps
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="glass-card p-6 h-full hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-extrabold font-[family-name:var(--font-heading)] text-border-custom/50">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-12 -right-4 w-8 items-center justify-center z-10">
                  <div className="w-full h-px bg-gradient-to-r from-primary/60 to-secondary/40" />
                  <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
