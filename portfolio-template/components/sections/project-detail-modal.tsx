'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SanityImage } from '@/components/shared/sanity-image';
import type { Project } from '@/lib/types';
import type { MorphOrigin } from '@/components/projects/project-desk-model';
import { PAPER_BRAND, getGrainDataUrl } from '@/components/projects/project-desk-paper-texture';

// One continuous Gem-clip wire, split in two so the back loop can sit behind the
// photo print and the front loop over it — that's what makes it read as clipped on.
const CLIP_BACK_PATH = 'M9 24V56a3.5 3.5 0 0 0 7 0V11';
const CLIP_FRONT_PATH = 'M16 11a5.5 5.5 0 0 0-11 0V61a7.5 7.5 0 0 0 15 0V22';

function PaperClip() {
  return (
    <>
      <svg className="paper-clip is-back" viewBox="0 0 24 72" aria-hidden="true">
        <defs>
          <linearGradient id="paper-clip-metal-back" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#8e949c" />
            <stop offset="0.5" stopColor="#c9cdd3" />
            <stop offset="1" stopColor="#7d838b" />
          </linearGradient>
        </defs>
        <path d={CLIP_BACK_PATH} stroke="url(#paper-clip-metal-back)" />
      </svg>
      <svg className="paper-clip is-front" viewBox="0 0 24 72" aria-hidden="true">
        <defs>
          <linearGradient id="paper-clip-metal-front" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#a7adb5" />
            <stop offset="0.45" stopColor="#eef0f3" />
            <stop offset="1" stopColor="#959ba3" />
          </linearGradient>
        </defs>
        <path d={CLIP_FRONT_PATH} stroke="url(#paper-clip-metal-front)" />
      </svg>
    </>
  );
}

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = contentRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      previouslyFocused?.focus?.();
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

  const grainUrl = project ? getGrainDataUrl() : null;
  const sheetStyle = grainUrl
    ? ({ '--paper-grain': `url(${grainUrl})` } as CSSProperties)
    : undefined;

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
            ref={contentRef}
            className="project-modal-content"
            style={sheetStyle}
            onClick={(e) => e.stopPropagation()}
            initial={contentInitial}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            exit={contentInitial}
            transition={{ duration: 0.5, ease: MORPH_EASE }}
          >
        <button
          ref={closeButtonRef}
          className="project-modal-close"
          onClick={onClose}
          type="button"
          aria-label={t('close')}
        >
          <X aria-hidden="true" />
        </button>

        <div className="project-modal-body">
          <div className="project-modal-head">
            <p className="project-modal-kicker">{project.category}</p>
            <span className="project-modal-badge">
              {project.status} · {project.year}
            </span>
          </div>

          {project.imageSrc || project.image ? (
            <figure className="paper-photo">
              <div className="paper-photo-print">
                <div className="paper-photo-image">
                  {project.imageSrc ? (
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 820px) 90vw, 30rem"
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  ) : project.image ? (
                    <SanityImage
                      image={project.image}
                      alt={project.image.alt ?? project.title}
                      fill
                      sizes="(max-width: 820px) 90vw, 30rem"
                      priority
                    />
                  ) : null}
                </div>
              </div>
              <PaperClip />
            </figure>
          ) : null}

          <h2 id="modal-project-title">{project.title}</h2>

          {project.role ? (
            <p className="project-modal-role">
              <span className="sr-only">{t('role')}: </span>
              <span aria-hidden="true">◆ </span>
              {project.role}
            </p>
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

          <p className="project-modal-watermark" aria-hidden="true">
            {PAPER_BRAND}
          </p>
        </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
