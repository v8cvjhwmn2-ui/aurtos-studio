'use client';

import {
  Megaphone,
  Palette,
  Code2,
  Smartphone,
  Cloud,
  Target,
  Search,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';

type ServiceItem = {
  label: string;
  icon: LucideIcon;
};

const services: ServiceItem[] = [
  { label: 'Digital Marketing', icon: Megaphone },
  { label: 'Branding & Design', icon: Palette },
  { label: 'Website Development', icon: Code2 },
  { label: 'App Development', icon: Smartphone },
  { label: 'Cloud & Hosting', icon: Cloud },
  { label: 'Ads & Tracking', icon: Target },
  { label: 'SEO Services', icon: Search },
  { label: 'Automation & AI', icon: Bot },
];

export function LogoMarquee() {
  return (
    <Section className="py-12 md:py-16 border-y border-border-custom bg-surface/50">
      <Container>
        <p className="text-center text-sm text-muted mb-8 uppercase tracking-widest font-medium">
          What we do best
        </p>
      </Container>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee">
          {[...services, ...services].map(({ label, icon: Icon }, i) => (
            <div
              key={`${label}-${i}`}
              className="flex-shrink-0 mx-4 md:mx-6 flex items-center gap-3 h-14 px-6 rounded-full border border-border-custom bg-background/60 backdrop-blur-sm hover:border-accent/50 hover:bg-background transition-colors"
            >
              <Icon className="w-5 h-5 text-accent shrink-0" strokeWidth={2} />
              <span className="text-base font-semibold text-foreground/80 whitespace-nowrap font-[family-name:var(--font-heading)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
