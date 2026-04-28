'use client';

import { Phone, MessageCircle, FileText } from 'lucide-react';
import { site } from '@/data/site';
import { trackWhatsAppClick, trackPhoneClick, trackCtaClick } from '@/lib/analytics';
import Link from 'next/link';

export function StickyMobileCTA() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I'm interested in your services."
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-border-custom">
      <div className="grid grid-cols-3 divide-x divide-border-custom">
        <a
          href={`tel:${site.phone}`}
          onClick={() => trackPhoneClick('mobile-sticky-bar')}
          className="flex flex-col items-center justify-center gap-1 py-3 text-muted hover:text-primary transition-colors"
          id="mobile-cta-call"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-medium">Call</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('mobile-sticky-bar')}
          className="flex flex-col items-center justify-center gap-1 py-3 text-[#25D366] hover:text-[#20bd5a] transition-colors"
          id="mobile-cta-whatsapp"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
        <Link
          href="/contact"
          onClick={() => trackCtaClick('Get Quote', 'mobile-sticky-bar')}
          className="flex flex-col items-center justify-center gap-1 py-3 text-primary hover:text-primary-glow transition-colors"
          id="mobile-cta-quote"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
