'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProjectCard } from './project-card';
import { ProjectDetailModal } from './project-detail-modal';
import type { Project } from '@/lib/types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('Site.projects');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

      <div className="project-deck-container">
        <div className="project-deck">
          {projects.map((project, index) => (
            <ProjectCard
              key={`${project.number}-${project.title}`}
              project={project}
              index={index}
              total={projects.length}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
              onSelect={setSelectedProject}
              viewLabel={t('viewProject')}
            />
          ))}
        </div>
        <p className="project-deck-instruction" aria-hidden="true">
          Kartların üzerine gelerek aralayabilir, detaylar için tıklayabilirsiniz.
        </p>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        viewProjectLabel={t('viewProject')}
      />
    </section>
  );
}
