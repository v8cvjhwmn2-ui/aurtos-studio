import { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Refund & Cancellation Policy',
  description: `Refund and cancellation policy for ${site.name}. Understand our refund process, cancellation terms, and how we handle disputes.`,
  path: '/refund-policy',
});

export default function RefundPolicyPage() {
  return (
    <>
      <section className="pt-32 pb-10">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-muted">Last updated: April 2025</p>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          <div className="space-y-8 text-muted text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                1. Overview
              </h2>
              <p>
                At {site.legalName} (doing business as {site.name}), we are committed to delivering high-quality digital services. This Refund & Cancellation Policy outlines the terms under which refunds and cancellations are processed for our services including website development, app development, digital marketing, branding, SEO, and other digital solutions.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                2. Cancellation Policy
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Before Project Commencement:</strong> If you wish to cancel your order before any work has begun, you are eligible for a full refund of the advance payment, minus any applicable transaction/processing fees.
                </li>
                <li>
                  <strong className="text-foreground">After Work Has Begun:</strong> If work has already commenced on your project, cancellation will be subject to deduction of charges for work already completed. The refund amount will be calculated based on the percentage of work delivered.
                </li>
                <li>
                  <strong className="text-foreground">Recurring/Subscription Services:</strong> For monthly services (digital marketing, SEO, social media management), cancellation must be requested at least 7 days before the next billing cycle. No refunds will be issued for the current billing period.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                3. Refund Eligibility
              </h2>
              <p>Refunds may be considered in the following cases:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>The project was not initiated by {site.name} within the agreed timeline due to our fault.</li>
                <li>Duplicate or excess payment was made by the client.</li>
                <li>The deliverable does not match the agreed scope of work as documented in the project proposal or agreement.</li>
                <li>The service was not delivered as per the agreed terms and no reasonable resolution could be reached.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                4. Non-Refundable Services
              </h2>
              <p>The following are non-refundable:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Domain registration and renewal fees</li>
                <li>Third-party hosting, software licenses, or subscriptions purchased on behalf of the client</li>
                <li>Ad spend budgets (Meta Ads, Google Ads, etc.) — these are paid directly to the advertising platforms</li>
                <li>Services that have been fully delivered and approved by the client</li>
                <li>Custom design or development work that has been completed and delivered</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                5. Refund Process
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To request a refund, email us at <a href={`mailto:${site.email}`} className="text-primary hover:text-primary-glow">{site.email}</a> with your order details and reason for the refund.</li>
                <li>Refund requests will be reviewed within 3-5 business days.</li>
                <li>If approved, refunds will be processed within 7-10 business days to the original payment method.</li>
                <li>Refund amount will be determined based on work completed at the time of cancellation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                6. Dispute Resolution
              </h2>
              <p>
                If you are unsatisfied with a deliverable, we encourage you to contact us first. We will work with you to resolve the issue — whether through revisions, corrections, or alternative solutions — before processing a refund. Our goal is your satisfaction, and we stand behind the quality of our work.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                7. Contact Us
              </h2>
              <p>
                For refund or cancellation requests, please contact:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">{site.legalName}</strong><br />
                Address: {site.address.street}, {site.address.city}, {site.address.state} - {site.address.postalCode}, {site.address.country}<br />
                Email: <a href={`mailto:${site.email}`} className="text-primary hover:text-primary-glow">{site.email}</a><br />
                WhatsApp: <a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}`} className="text-primary hover:text-primary-glow">{site.phone}</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
