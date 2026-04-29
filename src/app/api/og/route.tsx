import { renderOgImage } from '@/lib/og-template';

export const runtime = 'edge';
export const contentType = 'image/png';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return renderOgImage({
    title: searchParams.get('title') || 'Aurtos Studio',
    eyebrow: searchParams.get('eyebrow') || 'Aurtos Studio',
    subtitle:
      searchParams.get('subtitle') ||
      'Digital Marketing · Web · Apps · SEO',
  });
}
