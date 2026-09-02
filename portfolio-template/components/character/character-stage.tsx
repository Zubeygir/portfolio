'use client';

import dynamic from 'next/dynamic';

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
  return (
    <figure className="character-stage" aria-label={label}>
      <CharacterScene />
    </figure>
  );
}
