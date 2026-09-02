import { useTranslations } from 'next-intl';

export function AboutSection() {
  const t = useTranslations('Site.about');
  const technologies = t.raw('technologies') as string[];
  const skills = t.raw('skills') as string[];
  const tools = t.raw('tools') as string[];

  return (
    <section
      id="about"
      className="about-section shell"
      aria-labelledby="about-title"
    >
      <p className="section-index">{t('index')}</p>
      <div className="about-copy">
        <h2 id="about-title">{t('title')}</h2>
        <div className="about-details">
          <h3>{t('intro')}</h3>
          <div>
            <p>{t('lead')}</p>
            <p>{t('body')}</p>
          </div>
        </div>
      </div>
      <div className="about-toolkit">
        <ToolkitGroup title={t('technologyTitle')} items={technologies} />
        <ToolkitGroup title={t('skillsTitle')} items={skills} />
        <ToolkitGroup title={t('toolsTitle')} items={tools} />
      </div>
    </section>
  );
}

function ToolkitGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="toolkit-group">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
