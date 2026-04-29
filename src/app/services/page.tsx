import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { services } from '@/data/services';
import { generatePageMetadata } from '@/lib/seo';
import { ArrowUpRight, Megaphone, Palette, Code2, Smartphone, Cloud, Target, Search, Bot } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone, Palette, Code2, Smartphone, Cloud, Target, Search, Bot,
};

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Services — Digital Marketing, Web Dev, Branding & More',
  description:
    'Explore all services by Aurtos Studio: digital marketing, branding, website development, app development, SEO, cloud support, ad accounts, and AI automation.',
  keywords: [
    'digital marketing services',
    'web development services',
    'branding agency services',
    'app development services',
    'SEO services India',
  ],
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
        ]}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Services</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-6">
            Everything you need to <span className="gradient-text">grow online</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            From branding to ad campaigns to custom-built apps — we offer end-to-end digital services so you can focus on your business while we handle the growth.
          </p>
        </Container>
      </section>

      {/* Services List */}
      <Section>
        <Container>
          <div className="space-y-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Megaphone;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group block glass-card glass-card-hover p-6 md:p-8 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4 md:w-1/3">
                      <span className="text-3xl font-extrabold font-[family-name:var(--font-heading)] text-border-custom/40">
                        {service.number}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] group-hover:text-primary transition-colors">
                          {service.title}
                        </h2>
                        <p className="text-xs text-muted">{service.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted md:w-1/3 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="md:w-1/3 flex flex-wrap gap-2">
                      {service.items.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-surface-elevated text-muted font-medium"
                        >
                          {item}
                        </span>
                      ))}
                      {service.items.length > 4 && (
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          +{service.items.length - 4} more
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors shrink-0 hidden md:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
