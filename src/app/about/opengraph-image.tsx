import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';

export const runtime = 'edge';
export const alt = 'About Aurtos Studio — Our team, mission, and story';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    title: 'A team that ships growth, not just designs.',
    eyebrow: 'About Aurtos',
    subtitle: 'Founded 2024 · Based in Noida · 50+ brands served',
  });
}
