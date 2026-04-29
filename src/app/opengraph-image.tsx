import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'Aurtos Studio — Digital Marketing, Web & App Development Agency in India';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'We build brands that scale, websites that convert.',
    eyebrow: 'Aurtos Studio',
    subtitle: 'Full-stack digital agency · Noida, India',
  });
}
