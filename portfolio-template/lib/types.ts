// ─── Sanity types ──────────────────────────────────────────────────────────────

export interface SanityImageSource {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ─── Core types (used across all projects) ───────────────────────────────────

export interface SiteSettings {
  /** Primary brand name displayed in header/footer (e.g. "STUDIO/BASE") */
  brand: string;
  /** Contact email shown on the site */
  contactEmail?: string;
  /** Phone number */
  phone?: string;
  /** Physical address */
  address?: string;
  /** Canonical site URL (e.g. "https://example.com") */
  siteUrl?: string;
  /** Logo image */
  logo?: SanityImageSource;
  /** Open Graph / social preview image (1200×630) */
  ogImage?: SanityImageSource;
  /** SEO title override — falls back to brand if empty */
  seoTitle?: string;
  /** SEO meta description */
  seoDescription?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

// ─── Portfolio content types ─────────────────────────────────────────────────

export interface Project {
  _id?: string;
  number: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  description?: string;
  role?: string;
  highlights?: string[];
  technologies: string[];
  status: string;
  tone: 'warm' | 'dark' | 'accent';
  mark: string;
  href?: string;
  image?: SanityImageSource;
}

