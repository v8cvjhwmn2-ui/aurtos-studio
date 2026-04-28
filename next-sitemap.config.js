/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aurtostechnologies.in',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/thank-you', '/api/*'],
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1.0 : path.startsWith('/services') ? 0.9 : 0.7,
    lastmod: new Date().toISOString(),
  }),
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you'],
      },
    ],
  },
};
