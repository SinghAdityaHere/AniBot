import React from 'react';
import { Star, Calendar, Tv, Clock, Building } from 'lucide-react';
import { Anime } from '@anibot/shared';
import { FavouriteButton } from './FavouriteButton';

interface AnimeHeroProps {
  anime: Anime;
}

export const AnimeHero: React.FC<AnimeHeroProps> = ({ anime }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 32,
        alignItems: 'start',
        marginBottom: 40,
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-hover)',
          maxWidth: 320,
          aspectRatio: '2/3',
        }}
      >
        <img
          src={anime.image || 'https://via.placeholder.com/400x600?text=No+Cover'}
          alt={anime.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info & Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>{anime.title}</h1>
          {anime.alternativeTitles && anime.alternativeTitles.length > 0 && (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
              {anime.alternativeTitles.slice(0, 3).join(' • ')}
            </p>
          )}
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {anime.status && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: anime.status.toLowerCase().includes('finish')
                  ? '#e6f4ea'
                  : 'var(--color-accent-light)',
                color: anime.status.toLowerCase().includes('finish') ? '#137333' : 'var(--color-accent)',
              }}
            >
              {anime.status}
            </span>
          )}

          {anime.score !== undefined && anime.score !== null && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--color-score)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#fffbeb',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid #fde68a',
              }}
            >
              <Star size={16} fill="var(--color-score)" color="var(--color-score)" />
              {anime.score.toFixed(1)} / 10
            </span>
          )}
        </div>

        {/* Metadata summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            padding: 16,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
          }}
        >
          {anime.type && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tv size={16} color="var(--color-accent)" />
              <span>
                <strong>Type:</strong> {anime.type}
              </span>
            </div>
          )}
          {anime.episodes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--color-accent)" />
              <span>
                <strong>Episodes:</strong> {anime.episodes}
              </span>
            </div>
          )}
          {anime.airedInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="var(--color-accent)" />
              <span>
                <strong>Aired:</strong> {anime.airedInfo}
              </span>
            </div>
          )}
          {anime.studios && anime.studios.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={16} color="var(--color-accent)" />
              <span>
                <strong>Studio:</strong> {anime.studios.map((s) => s.name).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Genre Tags */}
        {anime.genres && anime.genres.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {anime.genres.map((g) => (
              <span key={g.id} className="genre-badge" style={{ fontSize: 12, padding: '6px 14px' }}>
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div style={{ marginTop: 8 }}>
          <FavouriteButton anime={anime} />
        </div>
      </div>
    </div>
  );
};
