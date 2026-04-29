import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Aurtos Studio Blog — SEO, marketing, web dev, and AI insights';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Insights on growth, code, and conversion.',
    eyebrow: 'Aurtos Blog',
    subtitle: 'SEO · Marketing · Web Dev · App Dev · AI Tools · Case Studies',
  });
}
