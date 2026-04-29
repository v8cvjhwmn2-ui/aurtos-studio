import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Aurtos Studio Portfolio — Featured case studies and client work';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Real brands. Real results. Real ROI.',
    eyebrow: 'Portfolio',
    subtitle: 'Case studies across D2C, SaaS, fintech, and e-commerce',
  });
}
