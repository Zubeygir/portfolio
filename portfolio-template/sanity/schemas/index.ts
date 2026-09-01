// ─── Core schemas (reusable across all projects) ─────────────────────────────
import { siteSettings } from './core/site-settings';

// ─── Site-specific schemas (demo — replace per client project) ───────────────
import { project } from './site/project';
import { service } from './site/service';
import { processStep } from './site/process-step';

/** All core schemas — keep these in every project */
export const coreSchemaTypes = [siteSettings];

/** Demo schemas — replace or remove for your client project */
export const siteSchemaTypes = [project, service, processStep];

/** Combined — used by sanity.config.ts */
export const schemaTypes = [...coreSchemaTypes, ...siteSchemaTypes];
