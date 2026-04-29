import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { Info, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warn' | 'success' | 'tip';
  children: React.ReactNode;
}) {
  const config = {
    info: { icon: Info, color: 'border-primary/40 bg-primary/5 text-primary' },
    warn: { icon: AlertTriangle, color: 'border-amber-500/40 bg-amber-500/5 text-amber-300' },
    success: { icon: CheckCircle2, color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300' },
    tip: { icon: Lightbulb, color: 'border-secondary/40 bg-secondary/5 text-secondary' },
  }[type];
  const Icon = config.icon;
  return (
    <div className={`my-6 flex items-start gap-3 rounded-xl border p-4 ${config.color}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="text-sm leading-relaxed text-foreground/90 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

const components = {
  // Headings
  h2: (props: ComponentProps<'h2'>) => (
    <h2 className="mt-12 mb-4 text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)]" {...props} />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 className="mt-8 mb-3 text-xl font-bold font-[family-name:var(--font-heading)]" {...props} />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 className="mt-6 mb-2 text-lg font-semibold font-[family-name:var(--font-heading)]" {...props} />
  ),
  // Body
  p: (props: ComponentProps<'p'>) => (
    <p className="my-4 text-base leading-relaxed text-muted" {...props} />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-muted" {...props} />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-muted" {...props} />
  ),
  li: (props: ComponentProps<'li'>) => <li className="leading-relaxed" {...props} />,
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote className="my-6 border-l-4 border-primary/60 pl-5 italic text-foreground/80" {...props} />
  ),
  code: (props: ComponentProps<'code'>) => (
    <code className="rounded bg-surface-elevated px-1.5 py-0.5 text-sm font-mono text-primary" {...props} />
  ),
  pre: (props: ComponentProps<'pre'>) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border-custom bg-surface-elevated p-4 text-sm" {...props} />
  ),
  hr: () => <hr className="my-10 border-border-custom" />,
  table: (props: ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentProps<'th'>) => (
    <th className="border-b border-border-custom px-3 py-2 text-left font-semibold text-foreground" {...props} />
  ),
  td: (props: ComponentProps<'td'>) => (
    <td className="border-b border-border-custom/50 px-3 py-2 text-muted" {...props} />
  ),
  a: ({ href = '', children, ...rest }: ComponentProps<'a'>) => {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className="text-primary underline-offset-4 hover:underline" {...rest}>
        {children}
      </Link>
    );
  },
  img: ({ src = '', alt = '', ...rest }: ComponentProps<'img'>) => (
    <Image
      src={src as string}
      alt={alt}
      width={1200 as any}
      height={630 as any}
      className="my-6 rounded-xl border border-border-custom"
      {...rest}
    />
  ),
  Callout,
};

export function MDXContent({ source }: { source: string }) {
  return (
    <article className="prose prose-invert max-w-none">
      <MDXRemote source={source} components={components} />
    </article>
  );
}
