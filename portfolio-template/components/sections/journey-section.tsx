import { useTranslations } from 'next-intl';
import type { JourneyItem } from '@/lib/types';

export function JourneySection({ items }: { items: JourneyItem[] }) {
  const t = useTranslations('Site.journey');

  return (
    <section
      id="journey"
      className="journey-section shell"
      aria-labelledby="journey-title"
    >
      <div className="journey-heading">
        <p className="section-index">{t('index')}</p>
        <h2 id="journey-title">{t('title')}</h2>
      </div>
      <div className="journey-list">
        {items.map((item) => (
          <article key={item.number}>
            <p className="journey-period">{item.period}</p>
            <div>
              <p className="journey-number">{item.number}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
