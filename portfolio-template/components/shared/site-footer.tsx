import { useTranslations } from 'next-intl';
import { GITHUB_URL, GithubIcon, LINKEDIN_URL, LinkedinIcon } from './social-links';

export function SiteFooter({ brand }: { brand: string }) {
  const tFooter = useTranslations('Site.footer');

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <p className="footer-wordmark">{brand}</p>
        <div className="footer-meta">
          <p>{tFooter('copyright')}</p>
          <div className="footer-social">
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubIcon />
            </a>
          </div>
        </div>
        <a className="footer-top-link" href="#top">
          {tFooter('backToTop')}
        </a>
      </div>
    </footer>
  );
}
