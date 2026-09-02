'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell flex flex-col items-center justify-center min-h-[70vh] text-center pt-32">
      <h1 className="text-3xl md:text-5xl font-medium mb-6">
        Something went wrong!
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again or contact support if the
        problem persists.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="header-cta hover:bg-primary transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/"
          className="header-cta bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
