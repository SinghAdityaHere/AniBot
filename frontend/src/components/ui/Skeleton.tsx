import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return <div className="skeleton skeleton-card" />;
};

export const AnimeGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="anime-grid" role="status" aria-label="Loading anime items">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const AnimeHeroSkeleton: React.FC = () => {
  return (
    <div
      className="skeleton"
      style={{ height: 420, borderRadius: 'var(--radius-lg)', width: '100%', marginBottom: 32 }}
      role="status"
      aria-label="Loading anime details"
    />
  );
};

export const QuoteCardSkeleton: React.FC = () => {
  return (
    <div
      className="skeleton"
      style={{ height: 140, borderRadius: 'var(--radius-lg)', width: '100%' }}
      role="status"
      aria-label="Loading anime quote"
    />
  );
};

export const ChipSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ width: 100, height: 36, borderRadius: 'var(--radius-pill)' }}
        />
      ))}
    </div>
  );
};
