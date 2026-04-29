import { notFound } from 'next/navigation';
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-template';
import { services } from '@/data/services';

export const runtime = 'edge';
export const alt = 'Aurtos Studio service';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  return renderOgImage({
    title: service.title,
    eyebrow: `Service ${service.number}`,
    subtitle: service.tagline,
  });
}
