import React from 'react';
import { Anime } from '@anibot/shared';
import { AnimeCard } from './AnimeCard';

interface AnimeGridProps {
  animes: Anime[];
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({ animes }) => {
  return (
    <div className="anime-grid">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};
