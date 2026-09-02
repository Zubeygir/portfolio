// ─── Core schemas (reusable across all projects) ─────────────────────────────
import { siteSettings } from './core/site-settings';

// ─── Site-specific schemas ───────────────────────────────────────────────────
import { project } from './site/project';

/** All core schemas — keep these in every project */
export const coreSchemaTypes = [siteSettings];

/** Portfolio schemas */
export const siteSchemaTypes = [project];

/** Combined — used by sanity.config.ts */
export const schemaTypes = [...coreSchemaTypes, ...siteSchemaTypes];
