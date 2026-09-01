/**
 * Site-specific section — DEMO / EXAMPLE.
 * Replace or modify the hero for your client project.
 */
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('Site');
  const tHero = useTranslations('Site.hero');

  return (
    <section id="top" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span>{tHero('eyebrow')}</span>
          <span>{t('status')}</span>
        </p>

        <h1 id="hero-title" dangerouslySetInnerHTML={{ __html: tHero.raw('title') }} />

        <div className="hero-foot">
          <p>{tHero('description')}</p>
          <a href="#work" className="text-link">
            {tHero('seeWork')} <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-stage" aria-label="Featured project placeholder">
        <div className="stage-topline">
          <span>{tHero('featured')}</span>
          <span>{tHero('strategy')}</span>
        </div>
        <div className="stage-window">
          <div className="stage-orbit stage-orbit-one" />
          <div className="stage-orbit stage-orbit-two" />
          <div className="stage-mark">A</div>
          <p>{tHero('replacePrompt')}</p>
        </div>
        <div className="stage-caption">
          <div>
            <p className="stage-kicker">{tHero('flagship')}</p>
            <h2>{tHero('flagshipTitle')}</h2>
          </div>
          <span>2026 ↗</span>
        </div>
      </div>
    </section>
  );
}
