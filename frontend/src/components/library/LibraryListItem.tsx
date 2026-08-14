import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, Tv, BookOpen } from 'lucide-react';
import { LibraryItem, LibraryCategory } from '@anibot/shared';
import { useLibraryMutations } from '../../api/library';

interface LibraryListItemProps {
  item: LibraryItem;
}

export const LibraryListItem: React.FC<LibraryListItemProps> = ({ item }) => {
  const navigate = useNavigate();
  const { removeItem, updateCategory } = useLibraryMutations();

  const title = item.title || item.mediaData?.title || 'Saved Title';
  const image = item.image || item.mediaData?.image || 'https://via.placeholder.com/60x90?text=Cover';
  const score = item.score !== undefined && item.score !== null ? item.score : item.mediaData?.score;

  const handleClick = () => {
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
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
        <img
          src={image}
          alt={title}
          style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', fontWeight: 700 }}>
              {item.mediaType === 'manga' ? <BookOpen size={12} /> : <Tv size={12} />} {item.mediaType}
            </span>
            {score !== undefined && score !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--color-score)', fontWeight: 700 }}>
                <Star size={12} fill="var(--color-score)" /> {score.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <select
          value={item.category}
          onChange={handleCategoryChange}
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
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

        <button
          onClick={handleRemove}
          style={{ padding: 6, borderRadius: '50%', color: 'var(--color-text-muted)' }}
          title="Remove item"
        >
          <Trash2 size={16} color="var(--color-error)" />
        </button>
      </div>
    </div>
  );
};
