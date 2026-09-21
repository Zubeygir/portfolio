'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProjectDeskScene, type ProjectDeskLabels } from '@/components/projects/project-desk-scene';
import type { MorphOrigin } from '@/components/projects/project-desk-model';
import { ProjectDetailModal } from './project-detail-modal';
import type { Project } from '@/lib/types';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const t = useTranslations('Site.projects');
  const tDesk = useTranslations('Site.projects.deskLabels');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activePaperIndex, setActivePaperIndex] = useState<number | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [morphOrigin, setMorphOrigin] = useState<MorphOrigin | null>(null);
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

  // Desk papers lift toward the camera, then the modal opens.
  const handleSelectPaper = useCallback(
    (index: number, origin?: MorphOrigin) => {
      const project = projects[index];
      if (!project) return;

      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

      setMorphOrigin(origin ?? null);
      setActivePaperIndex(index);
      setIsInspecting(true);

      openTimerRef.current = setTimeout(() => {
        setSelectedProject(project);
      }, 320);
    },
    [projects]
  );

  // The project list opens the modal directly (keyboard and touch path).
  const handleSelectFromList = useCallback((project: Project) => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMorphOrigin(null);
    setSelectedProject(project);
  }, []);

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
      <SectionHeading id="work-title" title={t('title')} description={t('description')} />

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

        <p className="project-desk-instruction" aria-hidden="true">
          {instruction}
        </p>
      </div>

      <ul className="project-index" aria-labelledby="work-title">
        {projects.map((project) => (
          <li key={project._id ?? project.title}>
            <button
              type="button"
              className="project-index-row"
              onClick={() => handleSelectFromList(project)}
            >
              <span className="project-index-year">{project.year}</span>
              <span className="project-index-title">{project.title}</span>
              <span className="project-index-category">{project.category}</span>
              <ArrowUpRight className="project-index-icon" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <ProjectDetailModal
        project={selectedProject}
        origin={morphOrigin}
        onClose={handleCloseModal}
        viewProjectLabel={t('viewProject')}
      />
    </section>
  );
}
