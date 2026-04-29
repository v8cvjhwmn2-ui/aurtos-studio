import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Contact Aurtos Studio — Get a free consultation';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'Let’s build something that drives real growth.',
    eyebrow: 'Contact Us',
    subtitle: 'Free 30-min consultation · Reply within 2 hours',
  });
}
