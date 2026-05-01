'use client';

import { useState, useRef, useEffect } from 'react';

const SERVICES = [
  { icon: '📣', title: 'Digital Marketing', slug: 'digital-marketing', sub: 'Meta Ads • Google Ads • Lead Gen' },
  { icon: '🎨', title: 'Branding', slug: 'branding', sub: 'Logo • Brand Kit • Packaging' },
  { icon: '💻', title: 'Website Development', slug: 'website-development', sub: 'Static • eCommerce • Portals' },
  { icon: '📱', title: 'App Development', slug: 'app-development', sub: 'Android • iOS • Hybrid' },
  { icon: '☁️', title: 'Technical + Cloud', slug: 'technical-cloud', sub: 'Hosting • API • Servers' },
  { icon: '🎯', title: 'AAM & Advertising', slug: 'aam-advertising', sub: 'Ad Accounts • Pixel • Tracking' },
  { icon: '🔍', title: 'SEO', slug: 'seo', sub: 'On-page • Technical • Local' },
  { icon: '🤖', title: 'Automation & AI', slug: 'automation', sub: 'WhatsApp Bots • CRM • AI Tools' },
];

const BUDGETS = ['₹10k – ₹25k', '₹25k – ₹1 Lakh', '₹1L – ₹5 Lakh', '₹5 Lakh+', 'Not sure yet'];

const BRAND = {
  accent: '#6366F1',
  accentGlow: '#818CF8',
  secondary: '#F472B6',
  bg: '#0A0A0F',
  surface: '#12121A',
  elevated: '#1A1A24',
  border: '#2A2A38',
  text: '#FAFAFA',
  muted: '#A1A1B5',
};

type Screen = 'menu' | 'services' | 'form' | 'success';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
}

export default function LeadWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', service: '', budget: '', message: '',
  });
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNotif, setHasNotif] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setHasNotif(true); }, 4000);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen, formStep, screen]);

  const openWhatsApp = (service?: string) => {
    const text = service
      ? `Hi, I'm interested in ${service} services.`
      : `Hi, I'd like to know more about Aurtos Studio services.`;
    window.open(`https://wa.me/916397845844?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleServiceClick = (svc: typeof SERVICES[0]) => {
    setSelectedService(svc.title);
    setFormData((p) => ({ ...p, service: svc.title }));
    setScreen('form');
    setFormStep(0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          budget: formData.budget,
          message: formData.message || `Interested in ${formData.service}`,
        }),
      });
    } catch {
      // Silent fail — still show success
    }
    setIsSubmitting(false);
    setScreen('success');
  };

  const formSteps = [
    {
      label: "What's your name?",
      field: 'name' as const,
      type: 'text',
      placeholder: 'Your full name',
      validate: (v: string) => v.trim().length >= 2,
    },
    {
      label: 'Email address?',
      field: 'email' as const,
      type: 'email',
      placeholder: 'you@company.com',
      validate: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    },
    {
      label: 'Phone / WhatsApp number?',
      field: 'phone' as const,
      type: 'tel',
      placeholder: '+91 XXXXX XXXXX',
      validate: (v: string) => v.replace(/\D/g, '').length >= 10,
    },
    {
      label: "What's your budget range?",
      field: 'budget' as const,
      type: 'select',
      placeholder: '',
      validate: (v: string) => v.length > 0,
    },
    {
      label: 'Anything specific you need? (optional)',
      field: 'message' as const,
      type: 'text',
      placeholder: 'Brief about your project...',
      validate: () => true,
    },
  ];

  const currentStep = formSteps[formStep];
  const canProceed = currentStep?.validate(formData[currentStep.field]) ?? false;

  const nextStep = () => {
    if (formStep < formSteps.length - 1) {
      setFormStep(formStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed) {
      e.preventDefault();
      nextStep();
    }
  };

  const reset = () => {
    setScreen('menu');
    setFormStep(0);
    setSelectedService('');
    setFormData({ name: '', email: '', phone: '', service: '', budget: '', message: '' });
  };

  return (
    <>
      <style>{`
        @keyframes lw-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 50%{box-shadow:0 0 0 14px rgba(99,102,241,0)} }
        @keyframes lw-slide-up { from{opacity:0;transform:translateY(16px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes lw-fade-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lw-check { from{transform:scale(0) rotate(-45deg)} to{transform:scale(1) rotate(0)} }
        .lw-scroll::-webkit-scrollbar{width:3px} .lw-scroll::-webkit-scrollbar-track{background:transparent} .lw-scroll::-webkit-scrollbar-thumb{background:${BRAND.border};border-radius:3px}
        .lw-svc:hover{background:${BRAND.elevated} !important;border-color:${BRAND.accent} !important;transform:translateX(4px)}
        .lw-budget:hover,.lw-budget-active{background:${BRAND.accent} !important;color:#fff !important;border-color:${BRAND.accent} !important}
        .lw-input:focus{border-color:${BRAND.accent} !important;outline:none}
      `}</style>

      {/* Widget Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 88, right: 20, width: 370, maxWidth: 'calc(100vw - 40px)',
          background: BRAND.surface, borderRadius: 16, border: `1px solid ${BRAND.border}`,
          overflow: 'hidden', zIndex: 9999, animation: 'lw-slide-up 0.25s ease-out',
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(99,102,241,0.08)`,
          display: 'flex', flexDirection: 'column',
          maxHeight: screen === 'menu' ? 440 : screen === 'success' ? 440 : 600,
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.secondary})`, flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#fff',
              }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                  Aurtos Studio
                </div>
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.7)' }}>
                  {screen === 'menu' ? 'How can we help?' : screen === 'services' ? 'Pick a service' : screen === 'form' ? `${selectedService}` : 'Thank you!'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {screen !== 'menu' && screen !== 'success' && (
                <button onClick={() => screen === 'form' && formStep > 0 ? setFormStep(formStep - 1) : setScreen('menu')}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ←
                </button>
              )}
              <button onClick={() => { setIsOpen(false); if (screen === 'success') reset(); }}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
          </div>

          {/* MENU SCREEN */}
          {screen === 'menu' && (
            <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => setScreen('services')} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: BRAND.elevated, border: `1px solid ${BRAND.border}`, borderRadius: 12,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
              }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = BRAND.accent; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${BRAND.accent},${BRAND.accentGlow})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🚀</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>Explore Our Services</div>
                  <div style={{ fontSize: 11.5, color: BRAND.muted, marginTop: 2 }}>8 services • Web, App, Ads, SEO & more</div>
                </div>
                <div style={{ marginLeft: 'auto', color: BRAND.muted, fontSize: 16 }}>›</div>
              </button>

              <button onClick={() => openWhatsApp()} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: BRAND.elevated, border: `1px solid ${BRAND.border}`, borderRadius: 12,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
              }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#25D366,#128C7E)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 11.5, color: BRAND.muted, marginTop: 2 }}>Quick reply • +91 6397845844</div>
                </div>
                <div style={{ marginLeft: 'auto', color: BRAND.muted, fontSize: 16 }}>›</div>
              </button>

              <button onClick={() => { setScreen('form'); setFormStep(0); setSelectedService('General Inquiry'); setFormData((p) => ({ ...p, service: 'General Inquiry' })); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: BRAND.elevated, border: `1px solid ${BRAND.border}`, borderRadius: 12,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
              }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = BRAND.secondary; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${BRAND.secondary},#FB923C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📝</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text }}>Get a Free Quote</div>
                  <div style={{ fontSize: 11.5, color: BRAND.muted, marginTop: 2 }}>Fill quick form • We&apos;ll call you back</div>
                </div>
                <div style={{ marginLeft: 'auto', color: BRAND.muted, fontSize: 16 }}>›</div>
              </button>
            </div>
          )}

          {/* SERVICES SCREEN */}
          {screen === 'services' && (
            <div className="lw-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SERVICES.map((svc, i) => (
                <button key={svc.slug} onClick={() => handleServiceClick(svc)} className="lw-svc" style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px',
                  background: 'transparent', border: `1px solid ${BRAND.border}`, borderRadius: 10,
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                  animation: `lw-fade-in 0.3s ease-out ${i * 0.04}s both`,
                }}>
                  <div style={{ fontSize: 22, width: 36, textAlign: 'center', flexShrink: 0 }}>{svc.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.text }}>{svc.title}</div>
                    <div style={{ fontSize: 10.5, color: BRAND.muted, marginTop: 1 }}>{svc.sub}</div>
                  </div>
                  <div style={{ color: BRAND.muted, fontSize: 14, flexShrink: 0 }}>›</div>
                </button>
              ))}
              <div style={{ padding: '8px 4px', textAlign: 'center' }}>
                <button onClick={() => openWhatsApp()} style={{
                  fontSize: 11, color: BRAND.accent, background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline',
                }}>
                  Or chat on WhatsApp →
                </button>
              </div>
            </div>
          )}

          {/* FORM SCREEN */}
          {screen === 'form' && currentStep && (
            <div className="lw-scroll" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, animation: 'lw-fade-in 0.25s ease-out', flex: 1, overflowY: 'auto' }}>
              {/* Progress */}
              <div style={{ display: 'flex', gap: 4 }}>
                {formSteps.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: i <= formStep ? BRAND.accent : BRAND.border,
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>

              {/* Service tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 6, background: BRAND.elevated,
                border: `1px solid ${BRAND.border}`, fontSize: 11, color: BRAND.muted,
                alignSelf: 'flex-start',
              }}>
                {SERVICES.find((s) => s.title === selectedService)?.icon || '📝'} {selectedService}
              </div>

              {/* Question */}
              <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.text, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                {currentStep.label}
              </div>

              {/* Input */}
              {currentStep.type === 'select' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {BUDGETS.map((b) => (
                    <button key={b} className={`lw-budget ${formData.budget === b ? 'lw-budget-active' : ''}`}
                      onClick={() => setFormData((p) => ({ ...p, budget: b }))}
                      style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: formData.budget === b ? BRAND.accent : BRAND.elevated,
                        border: `1px solid ${formData.budget === b ? BRAND.accent : BRAND.border}`,
                        color: formData.budget === b ? '#fff' : BRAND.text,
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s',
                      }}>
                      {b}
                    </button>
                  ))}
                </div>
              ) : (
                <input ref={inputRef} className="lw-input"
                  type={currentStep.type}
                  placeholder={currentStep.placeholder}
                  value={formData[currentStep.field]}
                  onChange={(e) => setFormData((p) => ({ ...p, [currentStep.field]: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  style={{
                    padding: '12px 14px', borderRadius: 10, fontSize: 14,
                    background: BRAND.elevated, border: `1px solid ${BRAND.border}`,
                    color: BRAND.text, transition: 'border-color 0.2s',
                  }}
                />
              )}

              {/* Next button */}
              <button onClick={nextStep}
                disabled={!canProceed || isSubmitting}
                style={{
                  padding: '12px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600,
                  background: canProceed ? `linear-gradient(135deg,${BRAND.accent},${BRAND.secondary})` : BRAND.border,
                  color: '#fff', cursor: canProceed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.7 : 1,
                }}>
                {isSubmitting ? 'Submitting...' : formStep === formSteps.length - 1 ? 'Submit →' : 'Next →'}
              </button>

              {/* Skip message step */}
              {currentStep.field === 'message' && (
                <button onClick={handleSubmit} style={{
                  background: 'none', border: 'none', color: BRAND.muted, fontSize: 12,
                  cursor: 'pointer', textDecoration: 'underline',
                }}>
                  Skip & submit
                </button>
              )}
            </div>
          )}

          {/* SUCCESS SCREEN */}
          {screen === 'success' && (
            <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'lw-fade-in 0.3s ease-out' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `linear-gradient(135deg,${BRAND.accent},${BRAND.secondary})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, animation: 'lw-check 0.4s ease-out',
              }}>✓</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.text, letterSpacing: '-0.02em' }}>Thank you, {formData.name.split(' ')[0]}!</div>
              <div style={{ fontSize: 13, color: BRAND.muted, lineHeight: 1.6, maxWidth: 260 }}>
                Our team will get back to you within 2 hours (9am–9pm IST). For instant help:
              </div>
              <button onClick={() => openWhatsApp(selectedService)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
                borderRadius: 10, background: '#25D366', border: 'none', cursor: 'pointer',
                color: '#fff', fontSize: 13, fontWeight: 600,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp us now
              </button>
              <button onClick={() => { reset(); setIsOpen(false); }} style={{
                background: 'none', border: 'none', color: BRAND.muted, fontSize: 11,
                cursor: 'pointer', marginTop: 4,
              }}>Close</button>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: '5px 16px 8px', textAlign: 'center', fontSize: 9.5, color: BRAND.muted, borderTop: `1px solid ${BRAND.border}`, flexShrink: 0 }}>
            <a href="https://aurtostechnologies.in" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.accent, textDecoration: 'none' }}>Aurtos Studio</a> • Noida, India
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setHasNotif(false); if (!isOpen && screen === 'success') reset(); }}
        aria-label={isOpen ? 'Close' : 'Get in touch'}
        style={{
          position: 'fixed', bottom: 20, right: 20, width: 56, height: 56, borderRadius: '50%',
          border: 'none', background: `linear-gradient(135deg,${BRAND.accent},${BRAND.secondary})`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10000, animation: isOpen ? 'none' : 'lw-pulse 2s infinite',
          transition: 'transform 0.2s', boxShadow: `0 4px 20px rgba(99,102,241,0.4)`,
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8.5 8.5 0 0 0-8.5 8.5c0 2.1.8 4 2.1 5.5L4 21l5-1.6c.9.4 1.9.6 3 .6a8.5 8.5 0 0 0 0-17z" />
            <circle cx="9" cy="11" r="0.8" fill="#fff" /><circle cx="12" cy="11" r="0.8" fill="#fff" /><circle cx="15" cy="11" r="0.8" fill="#fff" />
          </svg>
        )}
        {hasNotif && !isOpen && (
          <div style={{ position: 'absolute', top: -1, right: -1, width: 14, height: 14, borderRadius: '50%', background: '#EF4444', border: `2px solid ${BRAND.bg}` }} />
        )}
      </button>
    </>
  );
}
