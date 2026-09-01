import type { SiteSettings } from '../types';
import { siteConfig } from '../site.config';
import { urlFor } from '@/sanity/image';

export function getOrganizationSchema(settings: SiteSettings | null) {
  if (!settings) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.brand,
    url: settings.siteUrl || siteConfig.url,
    ...(settings.logo && urlFor(settings.logo) && {
      logo: urlFor(settings.logo)?.url(),
    }),
    ...(settings.contactEmail && {
      email: settings.contactEmail,
    }),
    ...(settings.phone && {
      telephone: settings.phone,
    }),
    ...(settings.address && {
      address: settings.address,
    }),
    ...(settings.socialLinks && settings.socialLinks.length > 0 && {
      sameAs: settings.socialLinks.map((link) => link.url),
    }),
  };
}

export function getWebSiteSchema(settings: SiteSettings | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.seoTitle || settings?.brand || siteConfig.name,
    url: settings?.siteUrl || siteConfig.url,
    description: settings?.seoDescription || siteConfig.description,
  };
}
