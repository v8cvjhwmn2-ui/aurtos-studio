'use client';

import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';

const brands = [
  'Daily Payments', 'SupplementDaddy', 'Kesari Tour & Travels', 'pureGuard',
  'Web Development', 'Logo Designing', 'Social Media Marketing', 'App Development',
];

export function LogoMarquee() {
  return (
    <Section className="py-12 md:py-16 border-y border-border-custom bg-surface/50">
      <Container>
        <p className="text-center text-sm text-muted mb-8 uppercase tracking-widest font-medium">
          Trusted by brands across India
        </p>
      </Container>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex-shrink-0 mx-10 flex items-center justify-center h-12"
            >
              <span className="text-lg font-bold text-muted/30 whitespace-nowrap font-[family-name:var(--font-heading)]">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
