import { Metadata } from 'next';
import { site } from '@/data/site';

interface GenerateMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '',
  ogImage = '/og/default.png',
}: GenerateMetadataProps): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      images: [
        {
          url: `${site.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${site.url}${ogImage}`],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  };
}
