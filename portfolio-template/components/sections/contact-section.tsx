import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactSection({ contactEmail }: { contactEmail: string }) {
  const t = useTranslations('Site.contact');

  return (
    <section
      id="contact"
      className="contact-section shell"
      aria-labelledby="contact-title"
    >
      <p className="section-index">{t('index')}</p>
      <div>
        <p className="contact-kicker">{t('kicker')}</p>
        <h2 id="contact-title">{t('title')}</h2>
        <a href={`mailto:${contactEmail}`} className="contact-link">
          {contactEmail} <ArrowUpRight aria-hidden="true" />
        </a>
        <p className="contact-note">{t('note')}</p>
      </div>
    </section>
  );
}
