import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@/lib/types';
import { client } from './client';

const builder = client ? imageUrlBuilder(client) : null;

/**
 * Build a Sanity image URL.
 * Returns null when Sanity is not configured (instead of throwing).
 */
export function urlFor(source: SanityImageSource) {
  if (!builder) return null;
  return builder.image(source);
}
