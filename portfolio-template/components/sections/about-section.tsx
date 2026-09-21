'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Download } from 'lucide-react';
import { ToolkitIcon } from '@/components/shared/toolkit-icon';

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export function AboutSection() {
  const t = useTranslations('Site.about');
  const locale = useLocale();
  const cvPath = locale === 'en' ? '/Zubeyir-Ali-Demir-CV-EN.pdf' : '/Zubeyir-Ali-Demir-CV-TR.pdf';
  const technologies = t.raw('technologies') as string[];
  const skills = t.raw('skills') as string[];
  const tools = t.raw('tools') as string[];
  const experience = t.raw('experience') as ExperienceItem[];
  const [openExperience, setOpenExperience] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="about-section shell"
      aria-labelledby="about-title"
    >
      <div className="about-copy">
        <h2 id="about-title">{t('title')}</h2>
        <div className="about-details">
          <div className="about-details-lead">
            <h3>{t('intro')}</h3>
            <a className="about-cv-link pill-button" href={cvPath} download>
              <Download aria-hidden="true" />
              <span>{t('downloadCv')}</span>
            </a>
          </div>
          <div className="about-details-body">
            <p>{t('lead')}</p>
            <p>{t('body')}</p>
          </div>
        </div>
      </div>

      <div className="about-experience">
        <h3>{t('experienceTitle')}</h3>
        <ul className="experience-list">
          {experience.map((item, index) => {
            const isOpen = openExperience === index;
            const detailId = `experience-detail-${index}`;

            return (
              <li key={`${item.company}-${item.role}`} className="experience-item">
                <button
                  type="button"
                  className="experience-row"
                  onClick={() => setOpenExperience(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                >
                  <span className="experience-period">{item.period}</span>
                  <span className="experience-role">{item.role}</span>
                  <span className="experience-company">{item.company}</span>
                  <ChevronDown className="experience-chevron" aria-hidden="true" />
                </button>
                <div id={detailId} className={`experience-detail${isOpen ? ' is-open' : ''}`}>
                  <div className="experience-detail-inner">
                    <ul className="experience-highlights">
                      {item.highlights.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="about-toolkit">
        <ToolkitGroup title={t('technologyTitle')} items={technologies} />
        <ToolkitGroup title={t('skillsTitle')} items={skills} showIcons={false} />
        <ToolkitGroup title={t('toolsTitle')} items={tools} />
      </div>
    </section>
  );
}

function ToolkitGroup({
  title,
  items,
  showIcons = true,
}: {
  title: string;
  items: string[];
  showIcons?: boolean;
}) {
  return (
    <div className="toolkit-group">
      <h3>{title}</h3>
      <ul className="toolkit-list">
        {items.map((item) => (
          <li key={item} className="toolkit-chip">
            {showIcons ? <ToolkitIcon label={item} /> : null}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
