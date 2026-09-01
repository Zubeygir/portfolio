/**
 * Environment variable validation for the project.
 *
 * Sanity is optional — when not configured the site runs with local
 * fallback content. But when partially configured (e.g. dataset set but
 * project ID missing) we surface clear warnings so developers can fix it.
 */

interface EnvValidationResult {
  /** true when all required Sanity env vars are present */
  sanityConfigured: boolean;
  /** Human-readable warnings for the developer console */
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const warnings: string[] = [];

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;

  // Sanity completely absent — that's fine, site works with fallback
  const anySanityVar = projectId || dataset || token;
  if (!anySanityVar) {
    return { sanityConfigured: false, warnings: [] };
  }

  // Partial config — warn the developer
  if (!projectId) {
    warnings.push(
      '[env] NEXT_PUBLIC_SANITY_PROJECT_ID is missing. Sanity CMS will not load. ' +
        'Set it in .env.local or remove all SANITY env vars to use fallback content.',
    );
  }

  if (projectId && !dataset) {
    warnings.push(
      '[env] NEXT_PUBLIC_SANITY_DATASET is missing — defaulting to "production".',
    );
  }

  if (projectId && !token) {
    warnings.push(
      '[env] SANITY_API_READ_TOKEN is not set. Authenticated requests (drafts) will not work.',
    );
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    warnings.push(
      '[env] NEXT_PUBLIC_SITE_URL is not set — using http://localhost:3000. ' +
        'Set it for correct canonical URLs and OG images in production.',
    );
  }

  return {
    sanityConfigured: !!projectId,
    warnings,
  };
}

/**
 * Log validation results once at startup.
 * Safe to call on both server and client — warnings only show in dev.
 */
export function logEnvWarnings(): void {
  if (process.env.NODE_ENV === 'production') return;

  const { warnings } = validateEnv();
  for (const w of warnings) {
    console.warn(w);
  }
}
