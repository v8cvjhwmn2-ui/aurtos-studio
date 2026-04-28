'use client';

import { MessageCircle } from 'lucide-react';
import { site } from '@/data/site';
import { trackWhatsAppClick } from '@/lib/analytics';

export function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I'm interested in your services. Can we discuss?"
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick('floating-button')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform duration-300 animate-pulse-glow group"
      aria-label="Chat on WhatsApp"
      id="floating-whatsapp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline text-sm font-semibold pr-1 max-w-0 group-hover:max-w-[100px] overflow-hidden transition-all duration-300 whitespace-nowrap">
        Chat Now
      </span>
    </a>
  );
}
