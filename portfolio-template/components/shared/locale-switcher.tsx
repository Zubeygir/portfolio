'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(newLocale: string) {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale, scroll: false });
    });
  }

  const label = locale === 'en' ? 'EN' : 'TR';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="locale-trigger"
        aria-label="Select language"
      >
        <Globe className="w-3 h-3" />
        <span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="locale-menu">
        <DropdownMenuItem
          onClick={() => onLocaleChange('tr')}
          className={`locale-option ${locale === 'tr' ? 'is-active' : ''}`}
        >
          Türkçe (TR)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLocaleChange('en')}
          className={`locale-option ${locale === 'en' ? 'is-active' : ''}`}
        >
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
