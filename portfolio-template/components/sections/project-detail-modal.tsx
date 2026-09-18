'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';
import type { MorphOrigin } from '@/components/projects/project-desk-model';

interface ProjectDetailModalProps {
  project: Project | null;
  origin?: MorphOrigin | null;
  onClose: () => void;
  viewProjectLabel?: string;
}

const MORPH_EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectDetailModal({
  project,
  origin,
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

  // Offset (px) from viewport center to the clicked paper, so the modal appears
  // to grow out of the spot on the desk it was opened from.
  const originOffset =
    origin && typeof window !== 'undefined'
      ? { x: origin.x - window.innerWidth / 2, y: origin.y - window.innerHeight / 2 }
      : null;

  const contentInitial = originOffset
    ? { x: originOffset.x, y: originOffset.y, scale: 0.15, opacity: 0 }
    : { x: 0, y: 16, scale: 0.95, opacity: 0 };

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="project-modal-backdrop"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: MORPH_EASE }}
        >
          <motion.div
            className="project-modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={contentInitial}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={contentInitial}
            transition={{ duration: 0.5, ease: MORPH_EASE }}
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
