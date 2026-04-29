'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, TrendingUp, Globe, Headphones, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { stats } from '@/data/stats';

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  TrendingUp,
  Globe,
  Headphones,
};

function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <Section variant="surface" className="py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.icon ?? ''] ?? Sparkles;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative glass-card p-6 md:p-8 text-center hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
                <p className="text-3xl md:text-5xl font-extrabold font-[family-name:var(--font-heading)] gradient-text mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="text-xs md:text-sm text-muted font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
