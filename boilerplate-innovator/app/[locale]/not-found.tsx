import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('Site');

  return (
    <main className="shell flex flex-col items-center justify-center min-h-[70vh] text-center pt-32">
      <h1 className="text-4xl md:text-6xl font-medium mb-6">404</h1>
      <p className="text-muted-foreground mb-8">This page could not be found.</p>
      <a href="/" className="header-cta hover:bg-primary transition-colors">
        Return Home
      </a>
    </main>
  );
}
