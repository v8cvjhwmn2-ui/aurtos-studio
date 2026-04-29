import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { blogPosts as legacyPosts } from '@/data/blog';

const MDX_DIR = path.join(process.cwd(), 'content/blog');

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;          // YYYY-MM-DD
  author?: string;
  category: string;
  tags?: string[];
  cover?: string;
  coverImage?: string;
  ogImage?: string;
  canonical?: string;
  draft?: boolean;
  faqs?: { question: string; answer: string }[];
  keywords?: string[];
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readingTime: string;
  source: 'mdx' | 'legacy';
};

export type BlogPost = BlogPostMeta & {
  content: string;       // raw MDX (or markdown for legacy)
};

function listMdxFiles(): string[] {
  if (!fs.existsSync(MDX_DIR)) return [];
  return fs
    .readdirSync(MDX_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));
}

function parseMdx(filename: string): BlogPost | null {
  const full = path.join(MDX_DIR, filename);
  const raw = fs.readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;
  if (!fm.title || !fm.date || !fm.category) {
    console.warn(`[mdx] skipping ${filename} — missing required frontmatter`);
    return null;
  }
  if (fm.draft) return null;
  const slug = filename.replace(/\.(mdx|md)$/, '');
  return {
    ...fm,
    slug,
    readingTime: readingTime(content).text,
    source: 'mdx',
    content,
  };
}

/** Returns all published posts (MDX preferred over legacy on slug collision). */
export function getAllPosts(): BlogPostMeta[] {
  const mdxPosts = listMdxFiles()
    .map(parseMdx)
    .filter((p): p is BlogPost => p !== null)
    .map((p) => stripContent(p));

  const mdxSlugs = new Set(mdxPosts.map((p) => p.slug));

  const legacyConverted: BlogPostMeta[] = legacyPosts
    .filter((p) => !mdxSlugs.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      author: p.author,
      category: p.category,
      readingTime: p.readingTime,
      source: 'legacy' as const,
    }));

  return [...mdxPosts, ...legacyConverted].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const mdxFile = listMdxFiles().find(
    (f) => f.replace(/\.(mdx|md)$/, '') === slug,
  );
  if (mdxFile) return parseMdx(mdxFile);

  const legacy = legacyPosts.find((p) => p.slug === slug);
  if (legacy) {
    return {
      slug: legacy.slug,
      title: legacy.title,
      description: legacy.description,
      date: legacy.date,
      author: legacy.author,
      category: legacy.category,
      readingTime: legacy.readingTime,
      source: 'legacy',
      content: legacy.content,
    };
  }
  return null;
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  return all
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}

function stripContent(p: BlogPost): BlogPostMeta {
  const { content: _content, ...meta } = p;
  void _content;
  return meta;
}
