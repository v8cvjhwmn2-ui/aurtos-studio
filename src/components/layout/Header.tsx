'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Megaphone,
  Palette,
  Code2,
  Smartphone,
  Cloud,
  Target,
  Search,
  Bot,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { cn } from '@/lib/utils';
import { services } from '@/data/services';
import { trackCtaClick } from '@/lib/analytics';

const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Palette,
  Code2,
  Smartphone,
  Cloud,
  Target,
  Search,
  Bot,
};

const navLinks = [
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isMobileOpen
          ? 'bg-background/80 backdrop-blur-xl border-b border-border-custom py-3'
          : 'bg-transparent py-5'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <BrandLogo
            href="/"
            ariaLabel="Aurtos Studio — home"
            width={180}
            height={48}
            priority
            linkClassName="relative z-50 flex items-center"
            imageClassName="h-9 md:h-10 w-auto"
            textClassName="text-lg md:text-xl"
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.hasDropdown ? (
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors"
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                    aria-expanded={isServicesOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                )}

                {/* Mega Menu */}
                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[860px] p-6 rounded-2xl z-[60] border border-white/10 shadow-2xl shadow-black/60"
                          style={{ background: '#0a0c16' }}
                          role="menu"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {services.map((service) => {
                              const Icon = iconMap[service.icon] || Megaphone;
                              return (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-elevated transition-colors group/item"
                                  onClick={() => setIsServicesOpen(false)}
                                  role="menuitem"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover/item:bg-primary/20 group-hover/item:scale-105 transition-all">
                                    <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors flex items-center gap-1.5">
                                      {service.title}
                                      <span className="text-[10px] font-mono text-muted/50">{service.number}</span>
                                    </p>
                                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                                      {service.tagline}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          <Link
                            href="/services"
                            className="mt-3 pt-3 border-t border-border-custom flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow transition-colors"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            View All Services
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              className="relative inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              onClick={() => trackCtaClick('Get Quote', 'header')}
              id="header-cta"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="relative z-50 lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            id="mobile-menu-toggle"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            className="fixed inset-0 z-[70] h-screen w-screen overflow-y-auto bg-[#0A0A0F] lg:hidden"
            style={{ height: '100dvh' }}
          >
            <div className="flex flex-col px-5 pt-5 pb-10">
              {/* Top bar — logo + close */}
              <div className="mb-6 flex items-center justify-between border-b border-border-custom pb-5">
                <BrandLogo
                  href="/"
                  ariaLabel="Aurtos Studio — home"
                  iconSize={32}
                  linkClassName="flex items-center"
                />
                <button
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border-custom text-foreground hover:border-primary hover:text-primary transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="border-b border-border-custom/60 py-5"
                  >
                    {link.hasDropdown ? (
                      <div className="flex flex-col gap-4">
                        <Link
                          href="/services"
                          className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          Services
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                          {services.map((service) => {
                            const Icon = iconMap[service.icon] || Megaphone;
                            return (
                              <Link
                                key={service.slug}
                                href={`/services/${service.slug}`}
                                className="flex items-center gap-2 rounded-xl border border-border-custom/70 bg-surface/40 px-3 py-2.5 text-xs font-medium text-muted hover:border-primary hover:text-foreground transition-colors"
                                onClick={() => setIsMobileOpen(false)}
                              >
                                <Icon className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                                <span className="truncate">{service.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* CTA */}
              <Link
                href="/contact"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white hover:bg-primary-glow transition-all"
                onClick={() => {
                  setIsMobileOpen(false);
                  trackCtaClick('Get Quote', 'mobile-menu');
                }}
              >
                Get Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
