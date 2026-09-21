'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from '@/hooks/use-in-view';

const CharacterScene = dynamic(
  () => import('./character-scene').then((module) => module.CharacterScene),
  {
    ssr: false,
    loading: () => (
      <div className="character-loading" aria-hidden="true">
        <span />
      </div>
    ),
  },
);

export function CharacterStage({ label }: { label: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  return (
    <figure ref={ref} className="character-stage" aria-label={label}>
      <CharacterScene active={inView} />
    </figure>
  );
}
