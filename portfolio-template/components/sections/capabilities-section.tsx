import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/shared/section-heading';
import type { Capability } from '@/lib/types';

export function CapabilitiesSection({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  const t = useTranslations('Site.capabilities');

  return (
    <section
      id="capabilities"
      className="capabilities-section"
      aria-labelledby="capabilities-title"
    >
      <div className="shell">
        <SectionHeading
          index={t('index')}
          id="capabilities-title"
          title={t('title')}
          description={t('description')}
          inverted
        />
        <div className="capability-list">
          {capabilities.map((capability) => (
            <article className="capability-item" key={capability.number}>
              <p>{capability.number}</p>
              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
              <ul aria-label={`${capability.title} tools`}>
                {capability.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
