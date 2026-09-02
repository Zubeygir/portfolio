import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProjectCard } from './project-card';
import type { Project } from '@/lib/types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('Site.projects');

  return (
    <section
      id="work"
      className="work-section shell"
      aria-labelledby="work-title"
    >
      <SectionHeading
        index={t('index')}
        id="work-title"
        title={t('title')}
        description={t('description')}
      />
      <div className="project-layout">
        {projects.map((project, index) => (
          <ProjectCard
            key={`${project.number}-${project.title}`}
            project={project}
            featured={index === 0}
            viewLabel={t('viewProject')}
          />
        ))}
      </div>
    </section>
  );
}
