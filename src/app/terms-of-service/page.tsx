import { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: `Terms of Service for ${site.name}. Read the terms governing your use of our website and digital services.`,
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <>
      <section className="pt-32 pb-10">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-muted">Last updated: April 2025</p>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          <div className="space-y-8 text-muted text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing and using the website and services of {site.legalName} (doing business as {site.name}), a Limited Liability Partnership registered under the LLP Act, 2008 of India, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                2. Services
              </h2>
              <p>
                {site.name} provides the following digital services:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Digital Marketing (Social Media, Meta Ads, Google Ads, YouTube Ads)</li>
                <li>Branding (Logo Design, Brand Kits, Packaging, Social Media Templates)</li>
                <li>Website Development (Static, Dynamic, eCommerce, Custom Portals)</li>
                <li>App Development (Android, iOS, Hybrid, Custom Dashboards)</li>
                <li>Technical & Cloud Support (Hosting, Domains, APIs, Server Management)</li>
                <li>AAM & Advertising Solutions (Agency Ad Accounts, Tracking Setup)</li>
                <li>SEO (On-page, Technical, Backlinks, Local SEO)</li>
                <li>Automation & AI (WhatsApp Automation, CRM, Bots)</li>
              </ul>
              <p className="mt-2">
                Specific terms for each engagement are covered in individual project proposals or service agreements signed between the parties.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                3. Client Obligations
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information required for service delivery.</li>
                <li>Share necessary access credentials, content, and approvals in a timely manner.</li>
                <li>Review and approve deliverables within the agreed timeline.</li>
                <li>Make payments as per the agreed payment schedule (see <a href="/payment-terms" className="text-primary hover:text-primary-glow">Payment Terms</a>).</li>
                <li>Ensure that all content provided does not infringe third-party rights.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                4. Intellectual Property
              </h2>
              <p>
                All content on this website — including text, graphics, logos, code, and design — is owned by {site.legalName} and protected under the Copyright Act, 1957 and other applicable Indian intellectual property laws. You may not reproduce, distribute, or create derivative works without our written consent.
              </p>
              <p className="mt-2">
                For project deliverables: ownership of custom-built work (websites, apps, designs) transfers to the client upon full payment as documented in the project agreement. Pre-existing frameworks, templates, and proprietary tools used by {site.name} remain our property.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                5. Payment & Pricing
              </h2>
              <p>
                All pricing is quoted in Indian Rupees (INR) and is subject to applicable taxes (GST). Detailed payment terms, schedules, and conditions are outlined in our <a href="/payment-terms" className="text-primary hover:text-primary-glow">Payment Terms</a> page. Key points:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Advance payment is required before project commencement</li>
                <li>Prices are valid for 15 days from the date of quotation</li>
                <li>Additional scope or revisions beyond the agreed scope may incur extra charges</li>
                <li>For refund terms, see our <a href="/refund-policy" className="text-primary hover:text-primary-glow">Refund & Cancellation Policy</a></li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                6. Confidentiality
              </h2>
              <p>
                Both parties agree to maintain the confidentiality of proprietary information exchanged during the course of the engagement. This includes business strategies, customer data, login credentials, and unpublished work. NDAs can be signed upon request for sensitive projects.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>{site.name} shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</li>
                <li>Our total liability shall not exceed the total amount paid by you for the specific service in question.</li>
                <li>We are not liable for losses caused by third-party platform changes (Meta, Google, hosting providers, etc.), Force Majeure events, or client-provided content.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                8. Disclaimer
              </h2>
              <p>
                While we strive to deliver the best results, {site.name} does not guarantee specific outcomes such as search engine rankings, ad performance metrics, or revenue targets. Digital marketing results depend on multiple external factors including market conditions, competition, and audience behavior.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                9. Termination
              </h2>
              <p>
                Either party may terminate the engagement with 15 days written notice. Upon termination:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment is due for all work completed up to the termination date</li>
                <li>All client-owned deliverables will be handed over upon settlement of dues</li>
                <li>Access to client systems/accounts will be revoked</li>
                <li>Confidentiality obligations survive termination</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                10. Governing Law & Jurisdiction
              </h2>
              <p>
                These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts in <strong className="text-foreground">Gautam Buddha Nagar (Noida), Uttar Pradesh, India</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                11. Modifications
              </h2>
              <p>
                We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                12. Contact
              </h2>
              <p>
                For questions about these Terms, contact us at:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">{site.legalName}</strong><br />
                Address: {site.address.street}, {site.address.city}, {site.address.state} - {site.address.postalCode}, {site.address.country}<br />
                Email: <a href={`mailto:${site.email}`} className="text-primary hover:text-primary-glow">{site.email}</a><br />
                Phone: <a href={`tel:${site.phone}`} className="text-primary hover:text-primary-glow">{site.phone}</a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
