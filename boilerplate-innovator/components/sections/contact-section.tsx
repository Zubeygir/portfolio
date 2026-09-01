/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ContactSection({ contactEmail }: { contactEmail: string }) {
  const tSections = useTranslations('Site.sections');

  return (
    <section id="contact" className="contact-section shell" aria-labelledby="contact-title">
      <p className="section-index">{tSections('contact.index')}</p>
      <div>
        <h2 id="contact-title">{tSections('contact.title')}</h2>
        <a href={`mailto:${contactEmail}`} className="contact-link">
          {contactEmail} <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
