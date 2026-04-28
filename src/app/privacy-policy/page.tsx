import { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: `Privacy Policy for ${site.name}. Learn how we collect, use, and protect your personal information in compliance with Indian data protection laws.`,
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-32 pb-10">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted">Last updated: April 2025</p>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          <div className="space-y-8 text-muted text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                1. Introduction
              </h2>
              <p>
                {site.legalName} (doing business as {site.name}), registered as a Limited Liability Partnership under the laws of India, is committed to protecting the privacy and personal data of our clients, website visitors, and users. This Privacy Policy explains how we collect, use, store, and protect your information in compliance with the Information Technology Act, 2000, the IT (Reasonable Security Practices) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                2. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, company name — provided when you fill contact forms, request quotes, or communicate with us via WhatsApp/email.</li>
                <li><strong className="text-foreground">Business Information:</strong> Project requirements, brand assets, login credentials (shared for service delivery) — treated as confidential.</li>
                <li><strong className="text-foreground">Payment Information:</strong> Transaction details are processed through PCI-DSS compliant payment gateways. We do not store card numbers, CVV, or bank details on our servers.</li>
                <li><strong className="text-foreground">Automatically Collected Data:</strong> IP address, browser type, device info, pages visited, and session duration — collected through cookies and analytics tools.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Deliver the services you have requested (websites, apps, marketing campaigns, etc.)</li>
                <li>Process payments and send invoices</li>
                <li>Send relevant updates about our services (with your consent)</li>
                <li>Improve our website performance and user experience</li>
                <li>Comply with legal obligations and regulatory requirements</li>
                <li>Prevent fraud and ensure security of transactions</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                4. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-foreground">Google Analytics (GA4):</strong> To analyze website traffic and understand user behavior</li>
                <li><strong className="text-foreground">Google Tag Manager:</strong> To manage marketing and analytics tags</li>
                <li><strong className="text-foreground">Meta Pixel:</strong> To measure ad campaign performance and retarget visitors</li>
                <li><strong className="text-foreground">Essential Cookies:</strong> Required for basic website functionality</li>
              </ul>
              <p className="mt-2">
                You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                5. Data Sharing & Third Parties
              </h2>
              <p>
                We do not sell, rent, or trade your personal data. We may share information with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong className="text-foreground">Payment Gateways:</strong> To process your payments securely</li>
                <li><strong className="text-foreground">Cloud/Hosting Providers:</strong> To host and deliver our services</li>
                <li><strong className="text-foreground">Analytics Providers:</strong> To understand website usage (anonymized data)</li>
                <li><strong className="text-foreground">Advertising Platforms:</strong> For campaign tracking and optimization</li>
                <li><strong className="text-foreground">Legal Authorities:</strong> If required by law, court order, or government regulation</li>
              </ul>
              <p className="mt-2">
                All third-party service providers are bound by confidentiality agreements and data protection obligations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                6. Data Retention
              </h2>
              <p>
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Generally:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Contact form data: 2 years</li>
                <li>Client project data: 1 year after project completion</li>
                <li>Financial/invoice records: 7 years (as required by Indian tax law)</li>
                <li>Analytics data: 26 months (Google Analytics default)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                7. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information, including SSL encryption, access controls, secure storage, and regular security audits. For detailed security practices, see our <a href="/data-security" className="text-primary hover:text-primary-glow">Data Security Policy</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                8. Your Rights (Under DPDP Act, 2023)
              </h2>
              <p>As a data principal, you have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access your personal data processed by us</li>
                <li>Request correction of inaccurate data</li>
                <li>Request erasure/deletion of your data</li>
                <li>Withdraw consent for data processing at any time</li>
                <li>Request data portability</li>
                <li>Nominate another person to exercise rights on your behalf</li>
                <li>Lodge a complaint with the Data Protection Board of India</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us at <a href={`mailto:${site.email}`} className="text-primary hover:text-primary-glow">{site.email}</a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                9. Children&apos;s Privacy
              </h2>
              <p>
                Our services are not directed at individuals under 18 years of age. We do not knowingly collect personal data from children. If we become aware of any such data, we will take steps to delete it promptly.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of our website after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                11. Grievance Officer
              </h2>
              <p>
                In accordance with the IT Act, 2000, the name and contact details of the Grievance Officer are:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Grievance Officer</strong><br />
                {site.legalName}<br />
                Address: {site.address.street}, {site.address.city}, {site.address.state} - {site.address.postalCode}, {site.address.country}<br />
                Email: <a href={`mailto:${site.email}`} className="text-primary hover:text-primary-glow">{site.email}</a><br />
                Phone: <a href={`tel:${site.phone}`} className="text-primary hover:text-primary-glow">{site.phone}</a><br />
                Response time: Within 30 days of receiving the complaint.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
