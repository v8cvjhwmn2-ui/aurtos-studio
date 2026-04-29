import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { LogoMarquee } from '@/components/sections/LogoMarquee';
import { Stats } from '@/components/sections/Stats';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { CTASection } from '@/components/sections/CTASection';
import { faqs } from '@/data/faqs';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/data/site';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Layers, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { portfolio } from '@/data/portfolio';

export const metadata: Metadata = {
  title: 'Aurtos Studio — Digital Marketing, Web & App Development Agency India',
  description:
    'Aurtos Studio is a full-stack digital agency in India. We build brands, websites, apps, and ad campaigns that drive measurable growth for startups and businesses.',
  keywords: [
    'digital marketing agency in India',
    'web development company India',
    'best digital agency for startups',
    'app development India',
    'SEO services India',
    'Meta ads agency',
    'branding agency India',
  ],
  alternates: {
    canonical: site.url,
  },
};

export default function HomePage() {
  return (
    <>
      {/* LocalBusiness Schema */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: site.name,
          description: site.description,
          url: site.url,
          telephone: site.phone,
          email: site.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.city,
            addressRegion: site.address.state,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
          openingHours: site.hours,
          priceRange: '₹₹',
          sameAs: Object.values(site.social).filter(Boolean),
        }}
      />
      <FAQSchema faqs={faqs} />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Logo Marquee */}
      <LogoMarquee />

      {/* 3. Stats */}
      <Stats />

      {/* 4. Services Grid */}
      <ServicesGrid />

      {/* 5. Why Aurtos */}
      <WhyAurtos />

      {/* 6. Process */}
      <Process />

      {/* 7. Featured Work */}
      <FeaturedWork />

      {/* 8. Testimonials */}
      <Testimonials />

      {/* 9. FAQ */}
      <FAQ faqs={faqs} />

      {/* 10. CTA */}
      <CTASection />
    </>
  );
}

function WhyAurtos() {
  const reasons = [
    {
      icon: Layers,
      title: 'End-to-End',
      description: 'One team, all services. No juggling multiple agencies — we handle everything from design to deployment to ads.',
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'Delivery in days, not months. We move fast without cutting corners because your growth can\'t wait.',
    },
    {
      icon: BarChart3,
      title: 'Performance-First',
      description: 'We measure ROI, not vanity metrics. Every rupee you spend is tracked, optimized, and accountable.',
    },
  ];

  return (
    <Section>
      <Container>
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Why Aurtos
          </p>
          <h2 className="font-[family-name:var(--font-heading)]">
            Built different. <span className="gradient-text">Built better.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="relative glass-card p-8 text-center hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300">
                <reason.icon className="w-8 h-8 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FeaturedWork() {
  const cardStyles: Record<string, { gradient: string; icon: string }> = {
    'Digital Marketing': {
      gradient: 'from-indigo-600/30 via-purple-600/20 to-pink-500/30',
      icon: '📈',
    },
    'SEO': {
      gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-500/30',
      icon: '🔍',
    },
    'App Development': {
      gradient: 'from-orange-600/30 via-rose-600/20 to-red-500/30',
      icon: '📱',
    },
    'Web Development': {
      gradient: 'from-blue-600/30 via-indigo-600/20 to-violet-500/30',
      icon: '🌐',
    },
    'Branding': {
      gradient: 'from-amber-600/30 via-yellow-600/20 to-orange-500/30',
      icon: '🎨',
    },
  };

  return (
    <Section variant="surface">
      <Container>
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h2 className="font-[family-name:var(--font-heading)]">
            Featured <span className="gradient-text">case studies</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.map((project) => {
            const style = cardStyles[project.category] || cardStyles['Web Development'];
            return (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group glass-card glass-card-hover overflow-hidden"
              >
                <div className={`aspect-video bg-gradient-to-br ${style.gradient} relative flex items-center justify-center overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Icon */}
                  <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {style.icon}
                  </span>
                  
                  {/* Category label on thumbnail */}
                  <span className="absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/80 font-semibold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                    {project.category} • {project.year}
                  </p>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.results.map((result) => (
                      <span
                        key={result}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow transition-colors"
          >
            View All Work →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
