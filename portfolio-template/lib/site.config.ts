/**
 * Central site configuration — deployment & application-level settings.
 *
 * This is NOT editorial content (that lives in Sanity).
 * These are static values used by metadata, sitemap, robots.txt, and
 * other infrastructure that needs to work even when Sanity is offline.
 */
export const siteConfig = {
  /** Default site name — overridden by Sanity siteSettings.brand when available */
  name: 'Zübeyir Ali Demir — Software Developer',

  /** Default meta description */
  description:
    'Software developer portfolio by Zübeyir Ali Demir — focused on thoughtful interfaces, practical engineering and interactive web experiences.',

  /** Canonical URL — set via NEXT_PUBLIC_SITE_URL env var */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  /** Default locale must match i18n/routing.ts */
  defaultLocale: 'en' as const,

  /** All supported locales — keep in sync with i18n/routing.ts */
  locales: ['en', 'tr'] as const,
} as const;

export type Locale = (typeof siteConfig.locales)[number];
