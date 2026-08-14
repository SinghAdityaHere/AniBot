import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { LibraryItem, LibraryCategory } from '@anibot/shared';
import { useLibraryMutations } from '../../api/library';

interface LibraryCardProps {
  item: LibraryItem;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { removeItem, updateCategory } = useLibraryMutations();

  const title = item.title || item.mediaData?.title || 'Saved Title';
  const image = item.image || item.mediaData?.image || 'https://via.placeholder.com/300x450?text=No+Cover';
  const score = item.score !== undefined && item.score !== null ? item.score : item.mediaData?.score;

  const handleCardClick = () => {
    if (item.mediaType === 'manga') {
      navigate(`/manga/${item.mediaId}`);
    } else {
      navigate(`/anime/${item.mediaId}`);
    }
  };

  const targetId = item.mediaId || item.id || item.mediaData?.id;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (targetId) {
      updateCategory({ mediaId: targetId, category: e.target.value as LibraryCategory });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (targetId) {
      removeItem(targetId);
    }
  };

  return (
    <div className="anime-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="anime-card-cover-wrapper">
        <img
          src={image}
          alt={title}
          className="anime-card-cover"
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: item.mediaType === 'manga' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(108, 99, 255, 0.9)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          {item.mediaType}
        </div>

        <button
          type="button"
          onClick={handleRemove}
          className="favourite-btn-overlay"
          title="Remove from Library"
          aria-label="Remove from library"
        >
          <Trash2 size={16} color="var(--color-error)" />
        </button>
      </div>

      <div className="anime-card-body">
        <h4 className="anime-card-title" title={title}>
          {title}
        </h4>

        <div style={{ marginTop: 4 }}>
          <select
            value={item.category}
            onChange={handleCategoryChange}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="favourited">Favourited</option>
            <option value="watching">Watching</option>
            <option value="reading">Reading</option>
            <option value="plan_to_watch">Plan to Watch</option>
            <option value="plan_to_read">Plan to Read</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {score !== undefined && score !== null && (
          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <span className="score-badge">
              <Star size={14} fill="var(--color-score)" color="var(--color-score)" />
              {score.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
