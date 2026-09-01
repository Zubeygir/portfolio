import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/studio'];

  // Combine default routes with all locales
  const sitemapEntries = routes.map((route) => {
    return {
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.5,
    };
  });

  return sitemapEntries;
}
