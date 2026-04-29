import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { portfolio } from '@/data/portfolio';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work — Portfolio & Case Studies',
  description:
    'See the results we\'ve delivered for brands across India. From 3x ROAS to 10K organic visitors — explore our case studies.',
  keywords: ['Aurtos Studio portfolio', 'digital marketing case studies', 'web development portfolio'],
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Portfolio', href: '/portfolio' },
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
            <span className="text-foreground">Portfolio</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-6">
            Real results. <span className="gradient-text">Real businesses.</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            We don&apos;t just build things — we build things that work. Here&apos;s proof.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((project) => {
              const cardStyles: Record<string, { gradient: string; icon: string }> = {
                'Digital Marketing': { gradient: 'from-indigo-600/30 via-purple-600/20 to-pink-500/30', icon: '📈' },
                'SEO': { gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-500/30', icon: '🔍' },
                'App Development': { gradient: 'from-orange-600/30 via-rose-600/20 to-red-500/30', icon: '📱' },
                'Web Development': { gradient: 'from-blue-600/30 via-indigo-600/20 to-violet-500/30', icon: '🌐' },
                'Branding': { gradient: 'from-amber-600/30 via-yellow-600/20 to-orange-500/30', icon: '🎨' },
              };
              const style = cardStyles[project.category] || cardStyles['Web Development'];
              return (
                <Link
                  key={project.slug}
                  href={`/portfolio/${project.slug}`}
                  className="group glass-card glass-card-hover overflow-hidden"
                >
                  <div className={`aspect-video bg-gradient-to-br ${style.gradient} relative flex items-center justify-center overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                    <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                      {style.icon}
                    </span>
                    <span className="absolute bottom-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/80 font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                      {project.category} • {project.year}
                    </p>
                    <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.results.map((result) => (
                        <span
                          key={result}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold"
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
