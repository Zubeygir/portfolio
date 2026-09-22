'use client';

import { useEffect, useState } from 'react';
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
  return (
    <a className="wordmark" href="#top" aria-label={`${name} home`}>
      <img src="/logo.png" alt="" width={56} height={56} />
    </a>
  );
}

export function SiteHeader() {
  const t = useTranslations('Site');
  const tHeader = useTranslations('Site.header');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 24);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  const navigation = [
    { label: t('navigation.work'), href: '#work' },
    { label: t('navigation.about'), href: '#about' },
  ];

  const brand = t('brand');

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
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
