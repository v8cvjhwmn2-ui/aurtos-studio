import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <Container className="text-center max-w-lg">
        <p className="text-8xl font-extrabold font-[family-name:var(--font-heading)] gradient-text mb-6">
          404
        </p>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Page not found
        </h1>
        <p className="text-muted mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-foreground border border-border-custom rounded-full hover:border-primary hover:text-primary transition-all"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div>
          <p className="text-sm text-muted mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Portfolio', href: '/portfolio' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs px-4 py-2 rounded-full border border-border-custom text-muted hover:text-primary hover:border-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
