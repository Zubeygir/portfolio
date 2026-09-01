import 'server-only';

import { client, isSanityConfigured } from '../client';
import { token } from '../env';
import type { QueryParams } from 'next-sanity';

// Server-only fetch wrapper for Sanity data
// Handles draft mode and caching automatically
// Returns null when Sanity is not configured
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T | null> {
  if (!isSanityConfigured || !client) {
    return null;
  }

  return client.fetch<T>(query, params, {
    ...(token ? { token } : {}),
    next: {
      revalidate: 60,
      tags,
    },
  });
}
