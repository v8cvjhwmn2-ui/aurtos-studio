import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { site } from '@/data/site';
import { services } from '@/data/services';
import { Mail, Phone, MapPin } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border-custom" role="contentinfo">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <BrandLogo
              href="/"
              ariaLabel="Aurtos Studio — home"
              width={180}
              height={48}
              linkClassName="inline-block"
              imageClassName="h-10 w-auto"
              textClassName="text-xl"
            />
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Full-stack digital agency helping startups, D2C brands, and businesses grow online — from logo to launch to leads.
            </p>
            <div className="flex items-center gap-3">
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}
              {site.social.linkedin && (
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="Follow us on LinkedIn"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              )}
              {site.social.facebook && (
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-of-service' },
                { label: 'Refund & Cancellation', href: '/refund-policy' },
                { label: 'Payment Terms', href: '/payment-terms' },
                { label: 'Data Security', href: '/data-security' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${site.phone}`}
                  className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-sm text-muted hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {site.address.street && `${site.address.street}, `}
                  {site.address.city && `${site.address.city}, `}
                  {site.address.state && `${site.address.state} - `}
                  {site.address.postalCode && `${site.address.postalCode}, `}
                  {site.address.country}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted">
              We reply within 2 hours, 9am–9pm IST
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border-custom flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted text-center sm:text-left space-y-1">
            <p>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </p>
            <p className="text-muted/70">
              LLP Reg.{' '}
              <span className="font-mono text-foreground/70">{site.llpRegistration}</span>
              <span className="mx-2 text-border-custom">·</span>
              GSTIN{' '}
              <span className="font-mono text-foreground/70">{site.gst}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-muted hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-muted hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/refund-policy" className="text-xs text-muted hover:text-primary transition-colors">
              Refund
            </Link>
            <Link href="/payment-terms" className="text-xs text-muted hover:text-primary transition-colors">
              Payment Terms
            </Link>
            <Link href="/data-security" className="text-xs text-muted hover:text-primary transition-colors">
              Data Security
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
