'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Megaphone, Palette, Code2, Smartphone, Cloud, Target, Search, Bot } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { services } from '@/data/services';
import { trackServiceCardClick } from '@/lib/analytics';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Palette,
  Code2,
  Smartphone,
  Cloud,
  Target,
  Search,
  Bot,
};

export function ServicesGrid() {
  return (
    <Section id="services">
      <Container>
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary uppercase tracking-widest mb-3"
          >
            What We Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-heading)]"
          >
            Full-stack digital services to{' '}
            <span className="gradient-text">grow your business</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Megaphone;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  onClick={() => trackServiceCardClick(service.title)}
                  className="group block h-full glass-card glass-card-hover p-6 transition-all duration-300"
                  id={`service-card-${service.slug}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted/50 font-bold">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-1 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted mb-4">{service.tagline}</p>

                  <ul className="space-y-1.5 mb-4">
                    {service.items.slice(0, 4).map((item) => (
                      <li key={item} className="text-xs text-muted/80 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                    {service.items.length > 4 && (
                      <li className="text-xs text-primary font-medium">
                        +{service.items.length - 4} more
                      </li>
                    )}
                  </ul>

                  <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
