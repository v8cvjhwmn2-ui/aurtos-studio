import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { FAQ } from '@/components/sections/FAQ';
import { ContactForm } from '@/components/forms/ContactForm';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { pricingData } from '@/data/pricing';
import { ArrowRight, CheckCircle, Megaphone, Palette, Code2, Smartphone, Cloud, Target, Search, Bot } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone, Palette, Code2, Smartphone, Cloud, Target, Search, Bot,
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.title} Services — ${site.name}`,
    description: `${service.description} Get expert ${service.title.toLowerCase()} services from ${site.name}, a leading digital agency in India.`,
    keywords: [service.primaryKeyword, ...service.items.slice(0, 5)],
    openGraph: {
      title: `${service.title} Services — ${site.name}`,
      description: service.description,
      url: `${site.url}/services/${service.slug}`,
      siteName: site.name,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} Services — ${site.name}`,
      description: service.description,
    },
    alternates: {
      canonical: `${site.url}/services/${service.slug}`,
    },
  };
}

const serviceFaqs: Record<string, { question: string; answer: string }[]> = {
  'digital-marketing': [
    { question: 'What platforms do you manage ads on?', answer: 'We manage campaigns on Meta (Facebook & Instagram), Google Ads, YouTube Ads, and LinkedIn Ads. We choose platforms based on your audience and business goals.' },
    { question: 'What is the minimum ad budget to get started?', answer: 'We recommend a minimum ad spend of ₹25,000/month for meaningful results. However, we can work with budgets as low as ₹10,000/month for testing and optimization.' },
    { question: 'How do you measure campaign success?', answer: 'We track ROI, ROAS, cost per lead, cost per acquisition, and conversion rates. You get weekly reports with clear metrics — no vanity numbers.' },
  ],
  'branding': [
    { question: 'What does a brand kit include?', answer: 'Our brand kits include logo (all variations), color palette, typography guidelines, social media templates, business card design, letterhead, and brand usage guidelines.' },
    { question: 'How many logo concepts do you provide?', answer: 'We provide 3-5 initial logo concepts based on your brief, followed by 2 rounds of revisions on the selected concept to get it perfect.' },
    { question: 'Can you redesign our existing brand?', answer: 'Absolutely! We handle both new brand creation and brand refreshes. We\'ll evaluate your current brand, identify what works, and refine what doesn\'t.' },
  ],
  'website-development': [
    { question: 'What technologies do you use for web development?', answer: 'We use modern frameworks like Next.js, React, and Node.js for custom projects. For simpler sites, we also work with WordPress and Shopify. The tech stack depends on your needs.' },
    { question: 'Do you provide hosting and maintenance?', answer: 'Yes! We offer managed hosting on reliable cloud infrastructure and monthly maintenance plans that include updates, backups, and performance monitoring.' },
    { question: 'Will my website be mobile-friendly?', answer: 'Every website we build is mobile-first and responsive across all devices. We test on multiple screen sizes to ensure a perfect experience everywhere.' },
  ],
  'app-development': [
    { question: 'Do you build native or hybrid apps?', answer: 'We build both! For most projects, we recommend React Native or Flutter for cost-effective cross-platform apps. For performance-critical apps, we build native Android (Kotlin) and iOS (Swift).' },
    { question: 'How long does it take to build an app?', answer: 'A typical MVP takes 4-8 weeks. Complex apps with many features can take 3-6 months. We break projects into sprints and deliver in phases so you see progress fast.' },
    { question: 'Do you handle app store submission?', answer: 'Yes, we handle the complete submission process for both Google Play Store and Apple App Store, including all required assets and compliance documentation.' },
  ],
  'technical-cloud': [
    { question: 'What hosting providers do you work with?', answer: 'We work with AWS, Google Cloud, DigitalOcean, Vercel, and traditional hosting providers. We recommend the best option based on your traffic and budget requirements.' },
    { question: 'Can you migrate our existing website?', answer: 'Yes, we handle complete website migrations with zero downtime. This includes DNS management, SSL setup, data migration, and post-migration testing.' },
    { question: 'Do you offer 24/7 server monitoring?', answer: 'Yes, we set up automated monitoring and alerting for server health, uptime, and performance. Critical issues trigger immediate alerts to our team.' },
  ],
  'aam-advertising': [
    { question: 'What are agency ad accounts?', answer: 'Agency ad accounts are verified, high-trust advertising accounts managed through our Business Manager. They offer higher spending limits, better delivery, and reduced risk of bans.' },
    { question: 'Can you set up tracking and pixels?', answer: 'Yes, we handle complete tracking setup — Meta Pixel, Google Tag Manager, GA4, conversion APIs, and server-side tracking for accurate attribution.' },
    { question: 'Do you provide real-time reporting?', answer: 'Yes, we set up custom dashboards with real-time data from all your ad platforms, giving you instant visibility into campaign performance.' },
  ],
  'seo': [
    { question: 'How long does SEO take to show results?', answer: 'SEO is a long-term strategy. You\'ll typically see initial improvements in 2-3 months, with significant results in 4-6 months. We focus on sustainable, white-hat techniques that build lasting authority.' },
    { question: 'Do you guarantee first page rankings?', answer: 'No ethical SEO agency can guarantee specific rankings, as search algorithms are controlled by Google. What we guarantee is a data-driven strategy, consistent execution, and transparent reporting.' },
    { question: 'What\'s included in your SEO services?', answer: 'Our SEO services include technical audit, on-page optimization, keyword research, content strategy, link building, local SEO, and monthly performance reports.' },
  ],
  'automation': [
    { question: 'What can be automated with WhatsApp?', answer: 'We automate order confirmations, appointment reminders, customer support chatbots, lead qualification, payment notifications, and follow-up sequences — all through the WhatsApp Business API.' },
    { question: 'Can you build a custom CRM?', answer: 'Yes! We build custom CRMs tailored to your workflow — from lead tracking and pipeline management to automated follow-ups and reporting dashboards.' },
    { question: 'Do you integrate with existing tools?', answer: 'Absolutely. We integrate with popular tools like Google Sheets, Notion, Slack, Razorpay, Shopify, and more through APIs and automation platforms.' },
  ],
};

const processSteps: Record<string, { title: string; description: string }[]> = {
  'digital-marketing': [
    { title: 'Audit & Strategy', description: 'We analyze your current marketing, competitors, and audience to build a data-driven strategy.' },
    { title: 'Creative & Copy', description: 'Our team creates scroll-stopping ad creatives and high-converting copy for your campaigns.' },
    { title: 'Launch & Optimize', description: 'We launch campaigns across platforms and continuously optimize for better performance.' },
    { title: 'Scale & Report', description: 'Once we find winners, we scale aggressively. You get weekly reports with clear ROI metrics.' },
  ],
  'branding': [
    { title: 'Discovery Workshop', description: 'We understand your brand personality, audience, and positioning through a structured brief.' },
    { title: 'Concept Design', description: 'Our designers create 3-5 unique logo concepts and visual direction options.' },
    { title: 'Refinement', description: 'We refine the chosen concept with your feedback until it\'s perfect.' },
    { title: 'Delivery', description: 'You receive the complete brand kit — logo files, color palette, typography, and templates.' },
  ],
  'website-development': [
    { title: 'Requirements & Wireframe', description: 'We map out your site structure, user flows, and content requirements.' },
    { title: 'Design', description: 'Pixel-perfect UI design with your brand guidelines, optimized for conversion.' },
    { title: 'Development', description: 'Clean, performant code with SEO best practices baked in from day one.' },
    { title: 'Launch & Support', description: 'We deploy, test, and provide 30 days of free post-launch support.' },
  ],
  'app-development': [
    { title: 'Planning & Architecture', description: 'We define features, choose the tech stack, and plan the development roadmap.' },
    { title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces designed for your specific user base.' },
    { title: 'Sprint Development', description: 'We build in 2-week sprints with regular demos and feedback loops.' },
    { title: 'Testing & Launch', description: 'Rigorous QA testing followed by app store submission and deployment.' },
  ],
  'technical-cloud': [
    { title: 'Assessment', description: 'We evaluate your current infrastructure and identify optimization opportunities.' },
    { title: 'Architecture Design', description: 'We design a scalable, secure infrastructure tailored to your needs.' },
    { title: 'Migration & Setup', description: 'Smooth migration with zero downtime and proper security configuration.' },
    { title: 'Monitoring & Support', description: 'Ongoing monitoring, backups, and technical support to keep everything running.' },
  ],
  'aam-advertising': [
    { title: 'Account Audit', description: 'We review your current ad accounts, tracking setup, and campaign history.' },
    { title: 'Account Setup', description: 'We set up verified agency ad accounts with proper tracking infrastructure.' },
    { title: 'Campaign Migration', description: 'We migrate existing campaigns to the new accounts with optimized settings.' },
    { title: 'Reporting Setup', description: 'Custom dashboards with real-time data from all your ad platforms.' },
  ],
  'seo': [
    { title: 'Technical Audit', description: 'Comprehensive audit of your site\'s technical health, speed, and crawlability.' },
    { title: 'Keyword Strategy', description: 'Research and map high-intent keywords to pages for maximum organic traffic.' },
    { title: 'On-Page & Content', description: 'Optimize existing pages and create new content targeting priority keywords.' },
    { title: 'Link Building & Tracking', description: 'Build quality backlinks and track rankings, traffic, and conversions monthly.' },
  ],
  'automation': [
    { title: 'Workflow Mapping', description: 'We map your current processes and identify automation opportunities.' },
    { title: 'System Design', description: 'Design the automation flows, integrations, and user interfaces.' },
    { title: 'Build & Integrate', description: 'Develop and connect automation tools with your existing systems.' },
    { title: 'Train & Optimize', description: 'Train your team and continuously optimize the automated workflows.' },
  ],
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.icon] || Megaphone;
  const faqs = serviceFaqs[slug] || [];
  const steps = processSteps[slug] || [];
  const relatedServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  const pricingTiers = pricingData[slug] || [
    {
      name: 'Starter',
      price: 'Custom',
      description: 'Perfect for small businesses getting started.',
      features: [service.items[0], service.items[1], 'Monthly Report', 'Email Support'],
      cta: 'Get Started',
    },
    {
      name: 'Growth',
      price: 'Custom',
      description: 'For businesses ready to scale aggressively.',
      features: [...service.items.slice(0, 4), 'Weekly Reports', 'Priority Support', 'Dedicated Manager'],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Custom',
      price: 'Let\'s Talk',
      description: 'Tailored solutions for unique requirements.',
      features: ['All Services', 'Custom Strategy', 'Daily Reports', '24/7 Support', 'SLA Guarantee'],
      cta: 'Contact Us',
    },
  ];

  return (
    <>
      <ServiceSchema
        name={service.title}
        description={service.description}
        slug={service.slug}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: service.title, href: `/services/${service.slug}` },
        ]}
      />
      {faqs.length > 0 && <FAQSchema faqs={faqs} />}

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <span>/</span>
            <span className="text-foreground">{service.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <Icon className="w-4 h-4" />
                {service.number} — {service.tagline}
              </div>
              <h1 className="font-[family-name:var(--font-heading)] mb-6">
                {service.title} <span className="gradient-text">Services</span>
              </h1>
              <p className="text-lg text-muted leading-relaxed mb-8">
                {service.description} Partner with {site.name} — a trusted {service.primaryKeyword} provider — and watch your business grow.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-glow transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service Items */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-4">
                What&apos;s Included
              </h2>
              <ul className="space-y-3">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-success shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Process */}
      {steps.length > 0 && (
        <Section variant="surface">
          <Container>
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
                Our Process
              </p>
              <h2 className="font-[family-name:var(--font-heading)]">
                How we deliver <span className="gradient-text">{service.title.toLowerCase()}</span> results
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.title} className="glass-card p-6 relative">
                  <span className="text-4xl font-extrabold font-[family-name:var(--font-heading)] text-primary/20 mb-3 block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-bold font-[family-name:var(--font-heading)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Pricing */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="font-[family-name:var(--font-heading)]">
              Choose the right plan for <span className="gradient-text">your growth</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-8 relative ${
                  tier.popular ? 'border-primary/50 ring-1 ring-primary/20' : ''
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold bg-primary text-white rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-1">
                  {tier.name}
                </h3>
                <div className="mb-2">
                  {'originalPrice' in tier && tier.originalPrice && (
                    <span className="text-sm text-muted line-through mr-2">{tier.originalPrice}</span>
                  )}
                  <span className="text-3xl font-extrabold font-[family-name:var(--font-heading)] gradient-text">
                    {tier.price}
                  </span>
                </div>
                <p className="text-xs text-muted mb-6">{tier.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="w-4 h-4 text-success shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block text-center w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    tier.popular
                      ? 'bg-primary text-white hover:bg-primary-glow hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]'
                      : 'border border-border-custom text-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <FAQ
          faqs={faqs}
          title={`${service.title} FAQ`}
          subtitle={`Common questions about our ${service.title.toLowerCase()} services.`}
        />
      )}

      {/* Related Services */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">
              Related Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => {
              const RelIcon = iconMap[rel.icon] || Megaphone;
              return (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="glass-card glass-card-hover p-6 group transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <RelIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold font-[family-name:var(--font-heading)] group-hover:text-primary transition-colors mb-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-muted">{rel.tagline}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Inline Form */}
      <Section variant="surface">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="font-[family-name:var(--font-heading)] mb-3">
              Get a free {service.title.toLowerCase()} consultation
            </h2>
            <p className="text-muted">
              Tell us about your project and we&apos;ll get back to you within 2 hours with a custom plan.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm preselectedService={service.slug} />
          </div>
        </Container>
      </Section>
    </>
  );
}
