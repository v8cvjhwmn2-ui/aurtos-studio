import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { CTASection } from '@/components/sections/CTASection';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { JsonLd } from '@/components/seo/JsonLd';
import { blogPosts } from '@/data/blog';
import { site } from '@/data/site';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${site.name} Blog`,
    description: post.description,
    keywords: [post.category, 'digital marketing', 'business growth'],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${site.url}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Simple markdown-to-HTML conversion for blog content
  const contentHtml = post.content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold font-[family-name:var(--font-heading)] mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold font-[family-name:var(--font-heading)] mt-10 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:text-primary-glow underline transition-colors">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-muted ml-4"><span class="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>$1</li>')
    .replace(/\n\n/g, '</p><p class="text-muted leading-relaxed mb-4">');

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: {
            '@type': 'Organization',
            name: post.author,
          },
          publisher: {
            '@type': 'Organization',
            name: site.name,
            url: site.url,
          },
          mainEntityOfPage: `${site.url}/blog/${post.slug}`,
        }}
      />

      <section className="relative pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px]" />
        </div>
        <Container className="relative z-10 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted mb-8" aria-label="Breadcrumb">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Posts
          </Link>

          <span className="inline-block text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold uppercase mb-4">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <Section className="pt-10">
        <Container className="max-w-3xl">
          <article
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: `<p class="text-muted leading-relaxed mb-4">${contentHtml}</p>` }}
          />
        </Container>
      </Section>

      {/* Author Bio */}
      <Section variant="surface" className="py-12">
        <Container className="max-w-3xl">
          <div className="glass-card p-6 flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-muted/40" />
            </div>
            <div>
              <p className="font-bold font-[family-name:var(--font-heading)]">{post.author}</p>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Full-stack digital agency helping startups and businesses grow. We write about digital marketing, SEO, web development, and business growth.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <Section>
          <Container className="max-w-3xl">
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-6">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="glass-card glass-card-hover p-5 group"
                >
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold uppercase">
                    {related.category}
                  </span>
                  <h3 className="text-sm font-bold font-[family-name:var(--font-heading)] mt-3 group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTASection />
    </>
  );
}
