'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { GITHUB_URL, GithubIcon, LINKEDIN_URL, LinkedinIcon } from '@/components/shared/social-links';

export function ContactSection({ contactEmail }: { contactEmail: string }) {
  const t = useTranslations('Site.contact');
  const locale = useLocale();
  const cvPath = locale === 'en' ? '/Zubeyir-Ali-Demir-CV-EN.pdf' : '/Zubeyir-Ali-Demir-CV-TR.pdf';
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`contact-section shell${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="contact-title"
    >
      <div>
        <h2 id="contact-title">{t('title')}</h2>
        <a href={`mailto:${contactEmail}`} className="contact-link pill-button">
          {contactEmail} <ArrowUpRight aria-hidden="true" />
        </a>
        <p className="contact-response-note">{t('responseNote')}</p>
        <ul className="contact-channels">
          <li>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              <LinkedinIcon />
              <span>{t('linkedinLabel')}</span>
            </a>
          </li>
          <li>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubIcon />
              <span>{t('githubLabel')}</span>
            </a>
          </li>
          <li>
            <a href={cvPath} download>
              <Download aria-hidden="true" />
              <span>{t('cvLabel')}</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
