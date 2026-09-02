import { defineQuery } from 'next-sanity';

// ─── Core queries ────────────────────────────────────────────────────────────

/** Site Settings (singleton) — core schema */
export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings"][0] {
    brand,
    contactEmail,
    phone,
    address,
    siteUrl,
    logo,
    ogImage,
    seoTitle,
    seoDescription,
    socialLinks[] { platform, url }
  }`,
);

// ─── Portfolio queries ───────────────────────────────────────────────────────

/** Projects — filtered by locale, ordered */
export const projectsQuery = defineQuery(
  `*[_type == "project" && language == $lang] | order(order asc) {
    _id,
    number,
    title,
    category,
    year,
    summary,
    technologies,
    status,
    tone,
    mark,
    href,
    image { ..., alt },
    order
  }`,
);
