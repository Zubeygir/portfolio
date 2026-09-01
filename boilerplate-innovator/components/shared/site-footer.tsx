import { useTranslations } from 'next-intl';

export function SiteFooter({ brand }: { brand: string }) {
  const tFooter = useTranslations('Site.footer');

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <p className="footer-wordmark">{brand}</p>
        <p>{tFooter('copyright')}</p>
        <a href="#top">{tFooter('backToTop')}</a>
      </div>
    </footer>
  );
}
