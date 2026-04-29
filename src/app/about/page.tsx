import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { site } from '@/data/site';
import { generatePageMetadata } from '@/lib/seo';
import { Users, Target, Heart, Eye, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Aurtos Studio — Our Story, Mission & Team',
  description:
    'Learn about Aurtos Studio, a full-stack digital agency in India. We help startups and businesses grow through digital marketing, web development, and technology.',
  keywords: [
    'about Aurtos Studio',
    'digital agency India',
    'Aurtos Technologies LLP',
    'team digital agency',
  ],
  path: '/about',
});

const values = [
  {
    icon: Target,
    title: 'Mission',
    description:
      'To democratize digital growth by providing world-class marketing, design, and tech services that are accessible, affordable, and results-driven for businesses of all sizes in India.',
  },
  {
    icon: Eye,
    title: 'Vision',
    description:
      'To become India\'s most trusted digital partner for startups and growing businesses — the team brands call first when they\'re ready to scale.',
  },
  {
    icon: Heart,
    title: 'Values',
    description:
      'Transparency in everything we do. Speed without cutting corners. Results over vanity metrics. Long-term partnerships over quick wins.',
  },
];

const differentiators = [
  {
    icon: Zap,
    title: 'Speed That Surprises',
    description: 'Most agencies take months. We ship in weeks. Your landing page in 3 days. Your brand kit in a week. No endless revisions.',
  },
  {
    icon: Shield,
    title: 'Skin in the Game',
    description: 'We don\'t just invoice and disappear. We track performance, share weekly reports, and optimize until you hit your numbers.',
  },
  {
    icon: Users,
    title: 'One Team, Everything',
    description: 'Design, development, ads, SEO, automation — all under one roof. No miscommunication between 5 different freelancers.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />

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
            <span className="text-foreground">About</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-6">
            We&apos;re a small team obsessed with <span className="gradient-text">growth</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Aurtos Studio was born out of frustration. We saw too many businesses burn money on agencies that delivered pretty reports but zero results. So we built something different.
          </p>
        </Container>
      </section>

      {/* Story */}
      <Section variant="surface">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-[family-name:var(--font-heading)]">Our Story</h2>
            <p className="text-muted leading-relaxed">
              Aurtos Technologies LLP started in {site.founded} with a simple belief: digital growth shouldn&apos;t require a massive budget or a 30-person team. Great results come from focused strategy, fast execution, and relentless optimization.
            </p>
            <p className="text-muted leading-relaxed">
              We&apos;ve worked with 50+ brands — from bootstrapped startups launching their first website to established D2C companies scaling to ₹2 crore+ in monthly ad spend. Every project taught us something, and we bring all of that experience to every new engagement.
            </p>
            <p className="text-muted leading-relaxed">
              Today, Aurtos Studio is a full-stack digital agency offering everything from branding and website development to Meta ads, SEO, app development, and AI automation. One team. All services. No excuses.
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission, Vision, Values */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              What Drives Us
            </p>
            <h2 className="font-[family-name:var(--font-heading)]">
              Mission, Vision & <span className="gradient-text">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => (
              <div
                key={item.title}
                className="glass-card p-8 text-center hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team */}
      <Section variant="surface">
        <Container>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Our Team
            </p>
            <h2 className="font-[family-name:var(--font-heading)]">
              Small team. <span className="gradient-text">Big impact.</span>
            </h2>
            <p className="text-muted mt-4 max-w-xl mx-auto">
              We&apos;re a lean team of designers, developers, and marketers who move fast and take ownership. No fluff, no hierarchy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { name: 'Keshav Swami', role: 'Founder & Strategy', initials: 'KS', gradient: 'from-indigo-500 to-purple-600' },
              { name: 'Harsh Patil', role: 'Co-founder & Development', initials: 'HP', gradient: 'from-emerald-500 to-teal-600' },
            ].map((member, i) => (
              <div key={i} className="glass-card p-8 text-center group hover:border-primary/50 transition-all duration-300">
                <div className={`w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-shadow`}>
                  <span className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                    {member.initials}
                  </span>
                </div>
                <p className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                  {member.name}
                </p>
                <p className="text-sm text-primary font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Work With Us */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Why Choose Us
            </p>
            <h2 className="font-[family-name:var(--font-heading)]">
              Why brands <span className="gradient-text">trust Aurtos</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="glass-card p-8 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
