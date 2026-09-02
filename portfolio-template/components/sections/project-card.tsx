'use client';

import { ArrowUpRight, Sparkles } from 'lucide-react';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
  onSelect: (project: Project) => void;
  viewLabel: string;
}

export function ProjectCard({
  project,
  index,
  total,
  hoveredIndex,
  onHover,
  onSelect,
  viewLabel,
}: ProjectCardProps) {
  const isHovered = hoveredIndex === index;
  const isShiftedLeft = hoveredIndex !== null && hoveredIndex > index;
  const isShiftedRight = hoveredIndex !== null && hoveredIndex < index;

  let deckClass = 'deck-item';
  if (isHovered) deckClass += ' is-hovered';
  else if (isShiftedLeft) deckClass += ' is-shifted-left';
  else if (isShiftedRight) deckClass += ' is-shifted-right';

  // Base rotation per index
  const baseRotation = (index - (total - 1) / 2) * 5.5;

  return (
    <div
      className={deckClass}
      style={
        {
          '--base-rotate': `${baseRotation}deg`,
          '--item-index': index,
        } as React.CSSProperties
      }
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`${project.title} - ${viewLabel}`}
    >
      <div className={`project-deck-visual is-${project.tone}`}>
        {project.image ? (
          <SanityImage
            image={project.image}
            alt={project.image.alt ?? project.title}
            fill
            sizes="(max-width: 768px) 90vw, 420px"
            className="project-image"
          />
        ) : (
          <>
            <span className="project-grid" />
            <span className="project-shape project-shape-one" />
            <span className="project-shape project-shape-two" />
            <span className="project-mark">{project.mark}</span>
          </>
        )}
        <span className="project-status">{project.status}</span>
        <span className="project-number">{project.number}</span>
      </div>

      <div className="project-deck-content">
        <div className="project-deck-top">
          <p className="project-deck-category">{project.category}</p>
          <h3 className="project-deck-title">{project.title}</h3>
        </div>

        <p className="project-deck-summary">{project.summary}</p>

        <div className="project-deck-footer">
          <div className="project-deck-tags">
            {project.technologies.slice(0, 2).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
            {project.technologies.length > 2 ? <span>+{project.technologies.length - 2}</span> : null}
          </div>
          <span className="project-deck-hint">
            <span>{viewLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
