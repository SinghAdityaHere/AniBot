import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Anime } from '@anibot/shared';
import { FavouriteButton } from './FavouriteButton';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/anime/${anime.id}`);
  };

  return (
    <div className="anime-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="anime-card-cover-wrapper">
        <img
          src={anime.image || 'https://via.placeholder.com/300x450?text=No+Cover'}
          alt={anime.title}
          className="anime-card-cover"
          loading="lazy"
        />
        <FavouriteButton anime={anime} overlay />
      </div>

      <div className="anime-card-body">
        <h4 className="anime-card-title" title={anime.title}>
          {anime.title}
        </h4>

        <div className="anime-card-meta">
          {anime.year && <span>{anime.year}</span>}
          {anime.year && anime.type && <span>•</span>}
          {anime.type && <span>{anime.type}</span>}
          {anime.episodes && (
            <>
              <span>•</span>
              <span>{anime.episodes} eps</span>
            </>
          )}
        </div>

        {anime.genres && anime.genres.length > 0 && (
          <div className="genre-badges">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g.id} className="genre-badge">
                {g.name}
              </span>
            ))}
          </div>
        )}

        {anime.score !== undefined && anime.score !== null && (
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <span className="score-badge">
              <Star size={14} fill="var(--color-score)" color="var(--color-score)" />
              {anime.score.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
