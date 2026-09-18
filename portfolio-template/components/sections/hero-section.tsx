'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Asterisk } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CharacterStage } from '@/components/character/character-stage';

export function HeroSection() {
  const t = useTranslations('Site.hero');
  const [isEntering, setIsEntering] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function enterPortfolio() {
    const target = document.querySelector('#work');
    if (!target) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reducedMotion) {
      target.scrollIntoView();
      return;
    }

    setIsEntering(true);
    timers.current.push(
      window.setTimeout(
        () => target.scrollIntoView({ behavior: 'smooth' }),
        320,
      ),
      window.setTimeout(() => setIsEntering(false), 1100),
    );
  }

  return (
    <section
      id="top"
      className={`hero ${isEntering ? 'is-entering' : ''}`}
      aria-labelledby="hero-title"
    >
      <div className="hero-grid shell">
        <div className="hero-copy">
          <p className="hero-kicker">
            <Asterisk aria-hidden="true" />
            {t('eyebrow')}
          </p>
          <h1 id="hero-title">{t('title')}</h1>
          <p className="hero-description">{t('description')}</p>
          <button className="hero-enter pill-button" type="button" onClick={enterPortfolio}>
            <span>{t('enter')}</span>
            <ArrowDown aria-hidden="true" />
          </button>
        </div>

        <div className="hero-character-wrap">
          <div className="character-orbit" aria-hidden="true" />
          <CharacterStage label={t('characterLabel')} />
          <p className="character-note">{t('characterNote')}</p>
        </div>

        <div className="hero-meta" aria-hidden="true">
          <span>{t('location')}</span>
          <span>{t('status')}</span>
        </div>
      </div>
      <div className="hero-wipe" aria-hidden="true" />
    </section>
  );
}
