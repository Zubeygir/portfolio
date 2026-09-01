/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import { SectionHeading } from '@/components/shared/section-heading';
import { ProjectCard } from './project-card';
import { useTranslations } from 'next-intl';
import type { Project } from '@/lib/types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const tSections = useTranslations('Site.sections');

  return (
    <section id="work" className="work-section shell" aria-labelledby="work-title">
      <SectionHeading
        index={tSections('work.index')}
        id="work-title"
        title={tSections('work.title')}
        description={tSections('work.description')}
      />

      <div className="project-layout">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            featured={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
