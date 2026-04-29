import { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { getAllPosts } from '@/lib/mdx';
import { portfolio } from '@/data/portfolio';

const BASE_URL = 'https://aurtostechnologies.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/payment-terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/data-security`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const servicePages = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPages = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const portfolioPages = portfolio.map((project) => ({
    url: `${BASE_URL}/portfolio/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...blogPages, ...portfolioPages];
}
