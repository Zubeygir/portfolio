import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('Site.loading');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium font-mono text-muted-foreground uppercase tracking-widest">
          {t('text')}
        </p>
      </div>
    </div>
  );
}
