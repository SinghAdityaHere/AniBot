import React from 'react';
import { Manga } from '@anibot/shared';
import { MangaCard } from './MangaCard';

interface MangaGridProps {
  mangas: Manga[];
}

export const MangaGrid: React.FC<MangaGridProps> = ({ mangas }) => {
  return (
    <div className="anime-grid">
      {mangas.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  );
};
