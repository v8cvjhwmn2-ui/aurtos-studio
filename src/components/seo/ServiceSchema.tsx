import { site } from '@/data/site';
import { JsonLd } from './JsonLd';

interface ServiceSchemaProps {
  name: string;
  description: string;
  slug: string;
}

export function ServiceSchema({ name, description, slug }: ServiceSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${site.url}/services/${slug}`,
    provider: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Services`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
          },
        },
      ],
    },
  };

  return <JsonLd data={data} />;
}
