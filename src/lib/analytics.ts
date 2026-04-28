'use client';

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', eventName, params);
  }

  // Also push to dataLayer for GTM
  if (typeof window !== 'undefined' && 'dataLayer' in window) {
    (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

export function trackFormStart(formName: string) {
  trackEvent('form_start', { form_name: formName });
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', { form_name: formName });
}

export function trackWhatsAppClick(location: string) {
  trackEvent('whatsapp_click', { click_location: location });
}

export function trackPhoneClick(location: string) {
  trackEvent('phone_click', { click_location: location });
}

export function trackCtaClick(ctaLabel: string, location: string) {
  trackEvent('cta_click', { cta_label: ctaLabel, click_location: location });
}

export function trackServiceCardClick(serviceName: string) {
  trackEvent('service_card_click', { service_name: serviceName });
}
