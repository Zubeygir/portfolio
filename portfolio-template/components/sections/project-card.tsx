/**
 * Site-specific section component — DEMO / EXAMPLE.
 * Replace or modify for your client project.
 */
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const style = {
    '--project-accent': project.accent,
  } as CSSProperties;

  const hasImage = !!project.image;

  return (
    <article
      className={`project-card ${featured ? 'is-featured' : ''}`}
      style={style}
    >
      <a href="#contact" aria-label={`View ${project.title} case study`}>
        <div
          className={`project-visual is-${project.tone}`}
          aria-hidden="true"
        >
          {hasImage ? (
            <SanityImage
              image={project.image!}
              alt={project.title}
              fill
              sizes={featured ? '100vw' : '(max-width: 720px) 100vw, 50vw'}
              priority={featured}
              className="project-image"
            />
          ) : (
            <>
              <span className="project-grid" />
              <span className="project-ring project-ring-one" />
              <span className="project-ring project-ring-two" />
              <span className="project-mark">{project.mark}</span>
            </>
          )}
          <span className="project-prompt">View case study ↗</span>
        </div>
        <div className="project-info">
          <div>
            <p>{project.number} / {project.category}</p>
            <h3>{project.title}</h3>
          </div>
          <p className="project-summary">{project.summary}</p>
          <span className="project-year">
            {project.year} <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}
