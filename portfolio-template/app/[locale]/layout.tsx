import type { Metadata } from 'next';
import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
} from 'next/font/google';
import localFont from 'next/font/local';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/lib/site.config';
import { sanityFetch } from '@/sanity/lib/fetch';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import type { SiteSettings } from '@/lib/types';
import { urlFor } from '@/sanity/image';

const bodyFont = Atkinson_Hyperlegible_Next({
  variable: '--font-body',
  subsets: ['latin', 'latin-ext'],
});

const monoFont = Atkinson_Hyperlegible_Mono({
  variable: '--font-mono-label',
  subsets: ['latin', 'latin-ext'],
});

const cabinetGrotesk = localFont({
  variable: '--font-cabinet-grotesk',
  src: [
    {
      path: '../../public/fonts/CabinetGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let settings: SiteSettings | null = null;
  try {
    settings = await sanityFetch<SiteSettings>({ query: siteSettingsQuery });
  } catch {
    // silently fail
  }

  const title = settings?.seoTitle || settings?.brand || siteConfig.name;
  const description = settings?.seoDescription || siteConfig.description;
  const siteUrl = new URL(settings?.siteUrl || siteConfig.url);

  const ogImageUrl = settings?.ogImage
    ? urlFor(settings.ogImage)?.width(1200).height(630).url()
    : new URL('/og.png', siteUrl).toString();

  const alternatesLanguages = routing.locales.reduce(
    (acc, l) => {
      acc[l] = `/${l}`;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    metadataBase: siteUrl,
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: alternatesLanguages,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: siteUrl,
      siteName: title,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      images: [
        {
          url: ogImageUrl || '',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl || ''],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.some((supportedLocale) => supportedLocale === locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${bodyFont.variable} ${monoFont.variable} ${cabinetGrotesk.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
