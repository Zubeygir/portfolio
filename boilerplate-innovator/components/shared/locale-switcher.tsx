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
      router.replace(pathname, { locale: newLocale });
    });
  }

  const label = locale === 'en' ? 'EN' : 'TR';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex items-center gap-2 border border-[var(--foreground)] px-3 py-2 text-[0.62rem] font-mono uppercase tracking-widest hover:bg-[var(--primary)] transition-colors focus:outline-none"
        aria-label="Select language"
      >
        <Globe className="w-3 h-3" />
        <span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px] rounded-none border border-[var(--foreground)] bg-[var(--background)] shadow-none p-0">
        <DropdownMenuItem 
          onClick={() => onLocaleChange('tr')}
          className={`font-mono text-[0.62rem] uppercase tracking-widest rounded-none py-2 px-3 ${locale === 'tr' ? 'bg-[var(--primary)]' : ''} cursor-pointer hover:bg-[var(--primary)]`}
        >
          Türkçe (TR)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onLocaleChange('en')}
          className={`font-mono text-[0.62rem] uppercase tracking-widest rounded-none py-2 px-3 ${locale === 'en' ? 'bg-[var(--primary)]' : ''} cursor-pointer hover:bg-[var(--primary)]`}
        >
          English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
