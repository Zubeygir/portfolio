import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { SanityImageSource } from '@/lib/types';

interface SanityImageProps {
  /** Sanity image field value */
  image: SanityImageSource;
  /** Alt text for accessibility */
  alt: string;
  /** Image width in pixels (required unless `fill` is true) */
  width?: number;
  /** Image height in pixels (required unless `fill` is true) */
  height?: number;
  /** Use fill mode (parent must have position: relative) */
  fill?: boolean;
  /** Responsive sizes attribute */
  sizes?: string;
  /** Additional CSS class */
  className?: string;
  /** Priority loading (above the fold images) */
  priority?: boolean;
  /** Image quality (1-100, default 80) */
  quality?: number;
}

/**
 * Reusable Sanity image component.
 *
 * Wraps Next/Image with Sanity CDN URL building.
 * Supports hotspot/crop via Sanity image URL builder.
 * Returns null if Sanity is not configured or image is missing.
 */
export function SanityImage({
  image,
  alt,
  width,
  height,
  fill = false,
  sizes,
  className,
  priority = false,
  quality = 80,
}: SanityImageProps) {
  const builder = urlFor(image);
  if (!builder) return null;

  // Build URL with appropriate dimensions
  let imgBuilder = builder.auto('format').quality(quality);

  if (!fill && width) {
    imgBuilder = imgBuilder.width(width);
  }
  if (!fill && height) {
    imgBuilder = imgBuilder.height(height);
  }

  const src = imgBuilder.url();

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        className={className}
        priority={priority}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
