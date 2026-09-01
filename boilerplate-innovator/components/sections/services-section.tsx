/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { useTranslations } from 'next-intl';
import type { Service } from '@/lib/types';

export function ServicesSection({ services }: { services: Service[] }) {
  const tSections = useTranslations('Site.sections');

  return (
    <section
      id="services"
      className="services-section shell"
      aria-labelledby="services-title"
    >
      <SectionHeading
        index={tSections('capabilities.index')}
        id="services-title"
        title={tSections('capabilities.title')}
        description={tSections('capabilities.description')}
      />

      <div className="services-list">
        {services.map((service) => (
          <article className="service-row" key={service.number}>
            <p className="service-number">{service.number}</p>
            <h3>{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul aria-label={`${service.title} deliverables`}>
              {service.deliverables.map((deliverable: string) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
            <ArrowUpRight className="service-arrow" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
