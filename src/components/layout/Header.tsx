'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Container } from '@/components/shared/Container';
import { cn } from '@/lib/utils';
import { services } from '@/data/services';
import { trackCtaClick } from '@/lib/analytics';

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
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border-custom py-3'
          : 'bg-transparent py-5'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex items-center gap-2 text-xl font-bold font-[family-name:var(--font-heading)]"
          >
            <span className="gradient-text text-2xl font-extrabold">Aurtos</span>
            <span className="text-foreground">Studio</span>
          </Link>

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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] p-6 rounded-2xl grid grid-cols-2 gap-3 z-[60] border border-white/10 shadow-2xl shadow-black/60"
                          style={{ background: '#0a0c16' }}
                        >
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-elevated transition-colors group/item"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <span className="text-primary text-xs font-mono font-bold mt-0.5">
                                {service.number}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                                  {service.title}
                                </p>
                                <p className="text-xs text-muted mt-0.5">
                                  {service.tagline}
                                </p>
                              </div>
                            </Link>
                          ))}
                          <Link
                            href="/services"
                            className="col-span-2 text-center text-sm font-medium text-primary hover:text-primary-glow mt-2 pt-3 border-t border-border-custom transition-colors"
                          >
                            View All Services →
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full gap-6 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {link.hasDropdown ? (
                    <div className="flex flex-col items-center gap-3">
                      <Link
                        href="/services"
                        className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        Services
                      </Link>
                      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                        {services.slice(0, 4).map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="text-xs text-muted hover:text-primary px-3 py-1.5 rounded-full border border-border-custom hover:border-primary transition-colors"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-2xl font-bold text-foreground font-[family-name:var(--font-heading)]"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all"
                  onClick={() => {
                    setIsMobileOpen(false);
                    trackCtaClick('Get Quote', 'mobile-menu');
                  }}
                >
                  Get Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
