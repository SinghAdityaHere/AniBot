import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, BookOpen, ExternalLink } from 'lucide-react';

interface RelatedMediaCardProps {
  id: string;
  name: string;
  type: string; // e.g. "Adaptation", "Side story", "Parent story", "Manga"
  mediaType?: 'anime' | 'manga' | string;
}

export const RelatedMediaCard: React.FC<RelatedMediaCardProps> = ({
  id,
  name,
  type,
  mediaType,
}) => {
  const navigate = useNavigate();
  const isManga = mediaType === 'manga' || id.startsWith('manga_') || id.startsWith('mangadex_');

  const handleClick = () => {
    if (isManga) {
      navigate(`/manga/${id}`);
    } else {
      navigate(`/anime/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      className="related-media-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isManga ? (
          <BookOpen size={20} color="var(--color-score)" />
        ) : (
          <Tv size={20} color="var(--color-accent)" />
        )}

        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
            Relationship: <strong style={{ color: 'var(--color-accent)' }}>{type}</strong>
          </div>
        </div>
      </div>

      <ExternalLink size={16} color="var(--color-text-muted)" />
    </div>
  );
};
