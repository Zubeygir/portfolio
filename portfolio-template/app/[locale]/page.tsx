import { getLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ContactSection } from '@/components/sections/contact-section';
import { SiteHeader } from '@/components/shared/site-header';
import { SiteFooter } from '@/components/shared/site-footer';
import { sanityFetch } from '@/sanity/lib/fetch';
import { projectsQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import type { Project, SiteSettings } from '@/lib/types';

export default async function Home() {
  const locale = await getLocale();
  let sanityProjects: Project[] = [];
  let sanitySettings: SiteSettings | null = null;

  try {
    const [projects, settings] = await Promise.all([
      sanityFetch<Project[]>({
        query: projectsQuery,
        params: { lang: locale },
        tags: ['project'],
      }),
      sanityFetch<SiteSettings>({
        query: siteSettingsQuery,
        tags: ['siteSettings'],
      }),
    ]);

    sanityProjects = projects ?? [];
    sanitySettings = settings ?? null;
  } catch {
    // Local message content keeps the portfolio usable without Sanity.
  }

  return (
    <HomeContent
      sanityProjects={sanityProjects}
      sanitySettings={sanitySettings}
    />
  );
}

function HomeContent({
  sanityProjects,
  sanitySettings,
}: {
  sanityProjects: Project[];
  sanitySettings: SiteSettings | null;
}) {
  const t = useTranslations('Site');
  const tProjects = useTranslations('Site.projects');

  const projects = sanityProjects.length
    ? sanityProjects
    : (tProjects.raw('items') as Project[]);
  const contactEmail = sanitySettings?.contactEmail ?? t('contact.email');
  const brand = sanitySettings?.brand ?? t('brand');

  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <ProjectsSection projects={projects} />
      <ContactSection contactEmail={contactEmail} />
      <SiteFooter brand={brand} />
    </main>
  );
}
