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
  }`
);

// ─── Site-specific queries (demo — replace per client project) ───────────────

/** Projects — filtered by locale, ordered */
export const projectsQuery = defineQuery(
  `*[_type == "project" && language == $lang] | order(order asc) {
    _id,
    number,
    title,
    category,
    year,
    summary,
    accent,
    tone,
    mark,
    image,
    order
  }`
);

/** Services — filtered by locale, ordered */
export const servicesQuery = defineQuery(
  `*[_type == "service" && language == $lang] | order(order asc) {
    _id,
    number,
    title,
    description,
    deliverables,
    order
  }`
);

/** Process Steps — filtered by locale, ordered */
export const processStepsQuery = defineQuery(
  `*[_type == "processStep" && language == $lang] | order(order asc) {
    _id,
    number,
    title,
    text,
    order
  }`
);
