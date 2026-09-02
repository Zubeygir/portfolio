import { ArrowUpRight } from 'lucide-react';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';

export function ProjectCard({
  project,
  featured = false,
  viewLabel,
}: {
  project: Project;
  featured?: boolean;
  viewLabel: string;
}) {
  const content = (
    <>
      <div className={`project-visual is-${project.tone}`} aria-hidden="true">
        {project.image ? (
          <SanityImage
            image={project.image}
            alt={project.image.alt ?? project.title}
            fill
            sizes={featured ? '100vw' : '(max-width: 720px) 100vw, 50vw'}
            priority={featured}
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
      </div>
      <div className="project-info">
        <div>
          <p>
            {project.number} / {project.category}
          </p>
          <h3>{project.title}</h3>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="project-meta">
          <p>{project.technologies.join(' · ')}</p>
          <span>{project.year}</span>
        </div>
      </div>
    </>
  );

  return (
    <article className={`project-card ${featured ? 'is-featured' : ''}`}>
      {project.href ? (
        <a href={project.href} target="_blank" rel="noreferrer">
          {content}
          <span className="sr-only">{viewLabel}</span>
          <ArrowUpRight className="project-arrow" aria-hidden="true" />
        </a>
      ) : (
        <div className="project-card-shell">{content}</div>
      )}
    </article>
  );
}
