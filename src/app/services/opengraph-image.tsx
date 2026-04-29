import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Aurtos Studio Services — Digital Marketing, Web, Apps, SEO, and more';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Full-stack digital services to grow your business.',
    eyebrow: 'Our Services',
    subtitle: 'Marketing · Branding · Web · Apps · Cloud · SEO · Automation',
  });
}
