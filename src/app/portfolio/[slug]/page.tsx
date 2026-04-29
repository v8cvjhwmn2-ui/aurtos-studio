import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { portfolio } from '@/data/portfolio';
import { site } from '@/data/site';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} — Case Study | ${site.name}`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      url: `${site.url}/portfolio/${project.slug}`,
    },
    alternates: {
      canonical: `${site.url}/portfolio/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = portfolio.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Portfolio', href: '/portfolio' },
          { name: project.title, href: `/portfolio/${project.slug}` },
        ]}
      />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </nav>

          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
              {project.category}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-surface-elevated text-muted font-semibold">
              {project.year}
            </span>
          </div>
        </Container>
      </section>

      {/* Project Details */}
      <Section>
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">
                Project Overview
              </h2>
              <p className="text-muted leading-relaxed">{project.description}</p>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">
                Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.results.map((result) => (
                  <div key={result} className="glass-card p-5 text-center">
                    <p className="text-lg font-bold gradient-text font-[family-name:var(--font-heading)]">
                      {result}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Used */}
            <div>
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-4">
                Services Used
              </h2>
              <ul className="space-y-2">
                {project.services.map((svc) => (
                  <li key={svc} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircle className="w-5 h-5 text-success" />
                    {svc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
