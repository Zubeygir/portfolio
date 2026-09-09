'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProjectDeskScene, type ProjectDeskLabels } from '@/components/projects/project-desk-scene';
import { ProjectDetailModal } from './project-detail-modal';
import type { Project } from '@/lib/types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('Site.projects');
  const tDesk = useTranslations('Site.projects.deskLabels');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activePaperIndex, setActivePaperIndex] = useState<number | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize labels with primitive string dependencies to ensure reference stability
  const projectPrefix = tDesk('projectPrefix');
  const clickForDetails = tDesk('clickForDetails');
  const clickToInspect = tDesk('clickToInspect');
  const instruction = tDesk('instruction');
  const loading = tDesk('loading');

  const deskLabels: ProjectDeskLabels = useMemo(
    () => ({
      projectPrefix,
      clickForDetails,
      clickToInspect,
      instruction,
      loading,
    }),
    [projectPrefix, clickForDetails, clickToInspect, instruction, loading]
  );

  // Handle opening a project with paper fly animation
  const handleSelectPaper = useCallback(
    (index: number) => {
      const project = projects[index];
      if (!project) return;

      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

      if (index < 5) {
        // Trigger 3D paper lift & zoom animation
        setActivePaperIndex(index);
        setIsInspecting(true);

        // After paper reaches inspection distance, reveal the detail modal
        openTimerRef.current = setTimeout(() => {
          setSelectedProject(project);
        }, 400);
      } else {
        // Direct modal open for projects beyond 5th
        setSelectedProject(project);
      }
    },
    [projects]
  );

  // Handle closing the detail modal with return animation
  const handleCloseModal = useCallback(() => {
    // 1. Hide modal immediately
    setSelectedProject(null);
    // 2. Instruct 3D paper to return to rest
    setIsInspecting(false);

    // 3. Clear active paper once it settles back on desk
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActivePaperIndex(null);
    }, 600);
  }, []);

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

      <div className="project-desk-section-container">
        {/* 3D Interactive Project Desk */}
        <ProjectDeskScene
          projects={projects}
          activePaperIndex={activePaperIndex}
          isInspecting={isInspecting}
          onPaperClick={handleSelectPaper}
          hoveredIndex={hoveredIndex}
          onHoverIndex={setHoveredIndex}
          labels={deskLabels}
        />

        {/* Quick Project Selectors / Navigation Bar */}
        <div className="desk-projects-bar" role="tablist" aria-label={t('title')}>
          {projects.map((project, index) => {
            const isHovered = hoveredIndex === index;
            const isActive = activePaperIndex === index || selectedProject?.number === project.number;

            return (
              <button
                key={project.number}
                type="button"
                className={`desk-project-tab ${isHovered ? 'is-hovered' : ''} ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectPaper(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`${project.number} - ${project.title}`}
              >
                <span className="tab-number">{project.number}</span>
                <span className="tab-title">{project.title}</span>
                <span className="tab-dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <p className="project-desk-instruction" aria-hidden="true">
          {instruction}
        </p>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={handleCloseModal}
        viewProjectLabel={t('viewProject')}
      />
    </section>
  );
}
