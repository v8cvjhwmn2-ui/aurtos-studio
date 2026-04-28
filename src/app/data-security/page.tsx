import { Metadata } from 'next';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';
import { Shield, Lock, Server, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Data Security Policy',
  description: `Data security policy for ${site.name}. Learn how we protect your data, ensure privacy, and comply with data protection regulations.`,
  path: '/data-security',
});

export default function DataSecurityPage() {
  return (
    <>
      <section className="pt-32 pb-10">
        <Container className="max-w-3xl">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-4">
            Data Security Policy
          </h1>
          <p className="text-sm text-muted">Last updated: April 2025</p>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="max-w-3xl">
          {/* Security Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Shield, label: 'PCI-DSS Compliant', desc: 'Payment security standards' },
              { icon: Lock, label: 'SSL Encrypted', desc: '256-bit encryption' },
              { icon: Server, label: 'Secure Hosting', desc: 'Enterprise-grade servers' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-5 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-8 text-muted text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                1. Our Commitment to Data Security
              </h2>
              <p>
                At {site.legalName}, we take the security of your data seriously. We implement industry-standard technical and organizational measures to protect your personal information, business data, and payment details from unauthorized access, disclosure, alteration, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                2. Data Collection & Storage
              </h2>
              <p>We collect and store the following types of data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong className="text-foreground">Personal Information:</strong> Name, email, phone number, company name — collected through forms, emails, or WhatsApp conversations for the purpose of service delivery and communication.
                </li>
                <li>
                  <strong className="text-foreground">Project Data:</strong> Files, designs, credentials, and content shared by clients during project execution. This data is treated as confidential.
                </li>
                <li>
                  <strong className="text-foreground">Payment Data:</strong> We do NOT store credit card numbers, CVV, or any sensitive payment information. All payment processing is handled by PCI-DSS compliant third-party payment gateways.
                </li>
                <li>
                  <strong className="text-foreground">Analytics Data:</strong> Website usage data collected via Google Analytics and similar tools for improving user experience. This data is anonymized.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                3. Technical Security Measures
              </h2>
              <ul className="space-y-3">
                {[
                  'SSL/TLS encryption (256-bit) across all web properties',
                  'Secure, encrypted communication channels for client data exchange',
                  'Regular security audits and vulnerability assessments',
                  'Access controls — client data is accessible only to assigned team members',
                  'Secure cloud hosting with automatic backups and failover',
                  'Two-factor authentication (2FA) on all internal systems',
                  'Regular software and dependency updates to patch vulnerabilities',
                ].map((measure) => (
                  <li key={measure} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                4. Client Data Handling
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All client credentials (hosting, CMS, ad accounts, etc.) are stored in encrypted password managers.</li>
                <li>Client project files are stored on secure, access-controlled cloud storage.</li>
                <li>We sign NDAs (Non-Disclosure Agreements) upon request for sensitive projects.</li>
                <li>Upon project completion or contract termination, client data is retained for 90 days for support purposes, after which it can be deleted upon written request.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                5. Third-Party Services
              </h2>
              <p>
                We use trusted third-party services for various functions. These include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Payment Gateways (Razorpay, etc.) — PCI-DSS Level 1 compliant</li>
                <li>Cloud Hosting (AWS, Vercel, DigitalOcean) — SOC 2 compliant</li>
                <li>Email Services — encrypted and compliant</li>
                <li>Analytics (Google Analytics) — anonymized data collection</li>
                <li>Advertising Platforms (Meta, Google) — governed by their own privacy policies</li>
              </ul>
              <p className="mt-2">
                We do not share your personal or business data with any third party for marketing purposes without your explicit consent.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                6. Incident Response
              </h2>
              <p>
                In the unlikely event of a data breach or security incident:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>We will notify affected clients within 72 hours of discovery</li>
                <li>We will take immediate steps to contain and remediate the incident</li>
                <li>We will cooperate with relevant authorities as required by law</li>
                <li>We will provide a detailed report of the incident and steps taken</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                7. Compliance
              </h2>
              <p>
                {site.name} complies with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Information Technology Act, 2000 (India)</li>
                <li>IT (Reasonable Security Practices and Procedures) Rules, 2011</li>
                <li>RBI guidelines on digital payments and data localization</li>
                <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                <li>PCI-DSS standards (via payment gateway partners)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                8. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request access to your personal data stored with us</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Lodge a complaint with the Data Protection Board of India</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)] mb-3">
                9. Contact — Data Protection
              </h2>
              <p>
                For data security concerns or to exercise your data rights, contact:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Data Protection Officer</strong><br />
                {site.legalName}<br />
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
