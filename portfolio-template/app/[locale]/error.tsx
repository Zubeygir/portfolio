'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Site.error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell flex flex-col items-center justify-center min-h-[70vh] text-center pt-32">
      <h1 className="text-3xl md:text-5xl font-medium mb-6">
        {t('title')}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {t('description')}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="header-cta hover:bg-primary transition-colors cursor-pointer"
        >
          {t('tryAgain')}
        </button>
        <Link
          href="/"
          className="header-cta bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
        >
          {t('returnHome')}
        </Link>
      </div>
    </main>
  );
}
