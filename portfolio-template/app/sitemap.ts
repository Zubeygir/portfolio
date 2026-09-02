import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.locales.map((locale) => {
    return {
      url: `${siteConfig.url}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    };
  });
}
