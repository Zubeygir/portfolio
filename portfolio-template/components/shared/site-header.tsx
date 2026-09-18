'use client';

import { ArrowUpRight, Menu } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './locale-switcher';

function Brand({ name }: { name: string }) {
  const [first, second] = name.split('/');

  return (
    <a className="wordmark" href="#top" aria-label={`${name} home`}>
      {first}
      {second ? (
        <>
          <span>/</span>
          {second}
        </>
      ) : null}
    </a>
  );
}

export function SiteHeader() {
  const t = useTranslations('Site');
  const tHeader = useTranslations('Site.header');

  const navigation = [
    { label: t('navigation.about'), href: '#about' },
    { label: t('navigation.work'), href: '#work' },
    { label: t('navigation.contact'), href: '#contact' },
  ];

  const brand = t('brand');

  return (
    <header className="site-header">
      <Brand name={brand} />

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4 justify-self-end">
        <LocaleSwitcher />
        <a className="header-cta pill-button fill-link" href="#contact">
          {tHeader('contact')}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <Sheet>
        <SheetTrigger className="menu-trigger" aria-label="Open navigation">
          <Menu aria-hidden="true" />
          <span>{tHeader('menu')}</span>
        </SheetTrigger>
        <SheetContent className="mobile-menu" side="right" showCloseButton>
          <SheetTitle className="sr-only">{tHeader('navigation')}</SheetTitle>
          <SheetDescription className="sr-only">
            {tHeader('jumpToSection')}
          </SheetDescription>
          <div className="flex justify-between items-center mb-[clamp(5rem,16vh,9rem)]">
            <p className="mobile-menu-brand mb-0">{brand}</p>
            <LocaleSwitcher />
          </div>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <SheetClose
                key={item.href}
                render={
                  <a
                    className="mobile-nav-link"
                    href={item.href}
                    aria-label={item.label}
                  />
                }
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" />
              </SheetClose>
            ))}
          </nav>
          <SheetClose
            render={
              <a
                className="mobile-menu-cta pill-button fill-link"
                href="#contact"
                aria-label={tHeader('contact')}
              />
            }
          >
            {tHeader('contact')}
            <ArrowUpRight aria-hidden="true" />
          </SheetClose>
        </SheetContent>
      </Sheet>
    </header>
  );
}
