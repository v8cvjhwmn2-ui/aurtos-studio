import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { blogPosts } from '@/data/blog';
import { generatePageMetadata } from '@/lib/seo';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog — Digital Marketing, SEO & Web Development Insights',
  description:
    'Read the latest insights on digital marketing, SEO, web development, and business growth from the Aurtos Studio team.',
  keywords: ['digital marketing blog', 'SEO tips', 'web development blog India'],
  path: '/blog',
});

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground">Blog</span>
          </nav>
          <h1 className="font-[family-name:var(--font-heading)] max-w-3xl mb-6">
            Insights to help you <span className="gradient-text">grow smarter</span>.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Actionable strategies, case studies, and honest advice on digital marketing, SEO, web development, and more.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass-card glass-card-hover overflow-hidden"
              >
                {(() => {
                  const blogStyles: Record<string, { gradient: string; icon: string }> = {
                    'SEO': { gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-500/30', icon: '🔍' },
                    'Digital Marketing': { gradient: 'from-indigo-600/30 via-purple-600/20 to-pink-500/30', icon: '📈' },
                    'Web Development': { gradient: 'from-blue-600/30 via-indigo-600/20 to-violet-500/30', icon: '💻' },
                  };
                  const s = blogStyles[post.category] || blogStyles['Web Development'];
                  return (
                    <div className={`aspect-video bg-gradient-to-br ${s.gradient} relative flex items-center justify-center overflow-hidden`}>
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                      <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {s.icon}
                      </span>
                    </div>
                  );
                })()}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
