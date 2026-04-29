import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Aurtos Studio — Get a Free Consultation',
  description:
    'Get in touch with Aurtos Studio for digital marketing, web development, branding, and more. Free consultation. We reply within 2 hours.',
  keywords: ['contact Aurtos Studio', 'digital agency contact', 'get a quote digital marketing'],
  path: '/contact',
});

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I'm interested in your services. Can we discuss?"
  )}`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />
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
        }}
      />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Contact</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-6">
            Let&apos;s build something <span className="gradient-text">great together</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Tell us about your project. We&apos;ll get back with a custom plan within 2 hours. No pressure, no fluff — just honest advice.
          </p>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form - Left */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Contact Info - Right */}
            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass-card p-5 hover:border-[#25D366]/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Chat on WhatsApp</p>
                  <p className="text-xs text-muted">Fastest way to reach us</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-4 glass-card p-5 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Call Us</p>
                  <p className="text-xs text-muted">{site.phone}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-4 glass-card p-5 hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Email Us</p>
                  <p className="text-xs text-muted">{site.email}</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 glass-card p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Office</p>
                  <p className="text-xs text-muted leading-relaxed">
                    {site.address.street}, {site.address.city}, {site.address.state} - {site.address.postalCode}, {site.address.country}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 glass-card p-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Business Hours</p>
                  <p className="text-xs text-muted">Monday – Saturday, 9:00 AM – 9:00 PM IST</p>
                  <p className="text-xs text-primary font-medium mt-1">We reply within 2 hours ⚡</p>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
