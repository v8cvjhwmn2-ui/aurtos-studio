import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Thank You — We\'ll Be in Touch Soon',
  description: 'Thank you for contacting Aurtos Studio. Our team will review your request and get back to you within 2 hours.',
  path: '/thank-you',
});

export default function ThankYouPage() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi, I just submitted a form on your website. Can we discuss?"
  )}`;

  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <Container className="text-center max-w-lg">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
          Thank you! 🎉
        </h1>
        <p className="text-muted text-lg mb-8 leading-relaxed">
          We&apos;ve received your request and our team is already on it. Expect a response within <span className="text-foreground font-semibold">2 hours</span> during business hours (9am–9pm IST).
        </p>

        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            What happens next?
          </h2>
          <ol className="text-left space-y-3 max-w-sm mx-auto">
            {[
              'Our team reviews your requirements',
              'We prepare a custom strategy',
              'You get a detailed proposal within 24 hours',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow transition-colors"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
