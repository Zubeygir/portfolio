/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import { SectionHeading } from '@/components/shared/section-heading';
import { useTranslations } from 'next-intl';
import type { ProcessStep } from '@/lib/types';

export function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  const tSections = useTranslations('Site.sections');

  return (
    <section id="process" className="process-section" aria-labelledby="process-title">
      <div className="shell">
        <SectionHeading
          index={tSections('processSection.index')}
          id="process-title"
          title={tSections('processSection.title')}
          inverted
        />

        <div className="process-grid">
          {steps.map((step) => (
            <article key={step.number}>
              <p>{step.number}</p>
              <h3>{step.title}</h3>
              <span>{step.text}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
