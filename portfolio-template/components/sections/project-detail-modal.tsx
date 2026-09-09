'use client';

import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  viewProjectLabel?: string;
}

export function ProjectDetailModal({
  project,
  onClose,
  viewProjectLabel = 'Projeyi İncele',
}: ProjectDetailModalProps) {
  const t = useTranslations('Site.projects.modalLabels');

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="project-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="project-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="project-modal-close"
          onClick={onClose}
          type="button"
          aria-label={t('close')}
        >
          <X aria-hidden="true" />
        </button>

        <div className="project-modal-visual">
          {project.image ? (
            <SanityImage
              image={project.image}
              alt={project.image.alt ?? project.title}
              fill
              priority
              className="project-modal-image"
            />
          ) : (
            <div className={`project-visual is-${project.tone} is-modal-cover`}>
              <span className="project-grid" />
              <span className="project-shape project-shape-one" />
              <span className="project-shape project-shape-two" />
              <span className="project-mark">{project.mark}</span>
            </div>
          )}
          <span className="project-status">{project.status}</span>
        </div>

        <div className="project-modal-body">
          <div className="project-modal-header">
            <p className="project-modal-kicker">
              {project.number} / {project.category} · {project.year}
            </p>
            <h2 id="modal-project-title">{project.title}</h2>
          </div>

          {project.role ? (
            <div className="project-modal-role">
              <p className="project-modal-label">{t('role')}</p>
              <p className="project-modal-role-value">{project.role}</p>
            </div>
          ) : null}

          <p className="project-modal-summary">
            {project.description || project.summary}
          </p>

          {project.highlights && project.highlights.length > 0 ? (
            <div className="project-modal-highlights">
              <p className="project-modal-label">{t('highlights')}</p>
              <ul className="project-modal-highlight-list">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="project-modal-toolkit">
            <p className="project-modal-label">{t('technologies')}</p>
            <ul className="project-modal-tags">
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          {project.href ? (
            <div className="project-modal-actions">
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="project-modal-cta"
              >
                <span>{viewProjectLabel}</span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
