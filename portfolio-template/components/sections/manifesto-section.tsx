/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ManifestoSection() {
  const tSections = useTranslations('Site.sections');

  return (
    <section id="studio" className="manifesto-section" aria-labelledby="studio-title">
      <div className="shell manifesto-grid">
        <p className="section-index">{tSections('studio.index')}</p>
        <h2 id="studio-title">{tSections('studio.title')}</h2>
        <div className="manifesto-copy">
          <p>{tSections('studio.copy')}</p>
          <a className="outline-link fill-link" href="#process">
            {tSections('studio.howWeWork')} <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
