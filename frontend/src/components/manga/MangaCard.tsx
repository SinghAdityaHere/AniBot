import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import { Manga } from '@anibot/shared';

interface MangaCardProps {
  manga: Manga;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const navigate = useNavigate();

  return (
    <div className="anime-card" onClick={() => navigate(`/manga/${manga.id}`)} role="button" tabIndex={0}>
      <div className="anime-card-cover-wrapper">
        <img
          src={manga.image || 'https://via.placeholder.com/300x450?text=No+Manga+Cover'}
          alt={manga.title}
          className="anime-card-cover"
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {manga.type || 'MANGA'}
        </div>
      </div>

      <div className="anime-card-body">
        <h4 className="anime-card-title" title={manga.title}>
          {manga.title}
        </h4>

        <div className="anime-card-meta">
          {manga.year && <span>{manga.year}</span>}
          {manga.year && manga.chapters && <span>•</span>}
          {manga.chapters && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <BookOpen size={12} /> {manga.chapters} ch
            </span>
          )}
        </div>

        {manga.score !== undefined && manga.score !== null && (
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <span className="score-badge">
              <Star size={14} fill="var(--color-score)" color="var(--color-score)" />
              {manga.score.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
