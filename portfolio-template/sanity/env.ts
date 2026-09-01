/**
 * Sanity environment variables.
 *
 * All values are optional — when NEXT_PUBLIC_SANITY_PROJECT_ID is missing,
 * the site falls back to local demo content (see sanity/client.ts).
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

// API version — use a fixed date to avoid unexpected breaking changes
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

// Server-only token for authenticated requests (drafts, etc.)
export const token = process.env.SANITY_API_READ_TOKEN;

// Preview secret for Draft Mode
export const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;
