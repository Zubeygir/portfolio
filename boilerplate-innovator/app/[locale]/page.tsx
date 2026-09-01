import { SiteHeader } from '@/components/shared/site-header';
import { SiteFooter } from '@/components/shared/site-footer';
import { HeroSection } from '@/components/sections/hero-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ManifestoSection } from '@/components/sections/manifesto-section';
import { ServicesSection } from '@/components/sections/services-section';
import { ProcessSection } from '@/components/sections/process-section';
import { ContactSection } from '@/components/sections/contact-section';

import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import {
  projectsQuery,
  servicesQuery,
  processStepsQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries';
import type { Project, Service, ProcessStep, SiteSettings } from '@/lib/types';

export default async function Home() {
  const locale = await getLocale();

  // Fetch dynamic content from Sanity — falls back to empty if not configured
  let sanityProjects: Project[] = [];
  let sanityServices: Service[] = [];
  let sanityProcess: ProcessStep[] = [];
  let sanitySettings: SiteSettings | null = null;

  try {
    const results = await Promise.all([
      sanityFetch<Project[]>({
        query: projectsQuery,
        params: { lang: locale },
        tags: ['project'],
      }),
      sanityFetch<Service[]>({
        query: servicesQuery,
        params: { lang: locale },
        tags: ['service'],
      }),
      sanityFetch<ProcessStep[]>({
        query: processStepsQuery,
        params: { lang: locale },
        tags: ['processStep'],
      }),
      sanityFetch<SiteSettings>({
        query: siteSettingsQuery,
        tags: ['siteSettings'],
      }),
    ]);
    sanityProjects = results[0] || [];
    sanityServices = results[1] || [];
    sanityProcess = results[2] || [];
    sanitySettings = results[3] || null;
  } catch {
    // Fail silently if Sanity isn't configured
  }

  return (
    <HomeContent
      sanityProjects={sanityProjects}
      sanityServices={sanityServices}
      sanityProcess={sanityProcess}
      sanitySettings={sanitySettings}
    />
  );
}

function HomeContent({
  sanityProjects,
  sanityServices,
  sanityProcess,
  sanitySettings,
}: {
  sanityProjects: Project[];
  sanityServices: Service[];
  sanityProcess: ProcessStep[];
  sanitySettings: SiteSettings | null;
}) {
  const t = useTranslations('Site');
  const tProjects = useTranslations('Site.projects');
  const tServices = useTranslations('Site.services');
  const tProcess = useTranslations('Site.process');
  const tSections = useTranslations('Site.sections');

  // Fallback to JSON messages if Sanity returns no data
  const projects = sanityProjects?.length > 0
    ? sanityProjects
    : (tProjects.raw('items') as Project[]);
  const services = sanityServices?.length > 0
    ? sanityServices
    : (tServices.raw('items') as Service[]);
  const processSteps = sanityProcess?.length > 0
    ? sanityProcess
    : (tProcess.raw('items') as ProcessStep[]);

  const contactEmail = sanitySettings?.contactEmail || tSections('contact.email');
  const brand = sanitySettings?.brand || t('brand');

  return (
    <main>
      <SiteHeader />
      
      <HeroSection />
      
      <ProjectsSection projects={projects} />
      
      <ManifestoSection />
      
      <ServicesSection services={services} />
      
      <ProcessSection steps={processSteps} />
      
      <ContactSection contactEmail={contactEmail} />

      <SiteFooter brand={brand} />
    </main>
  );
}
