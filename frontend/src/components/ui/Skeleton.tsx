import React from 'react';

export const AnimeCardSkeleton: React.FC = () => {
  return <div className="skeleton skeleton-card" />;
};

export const AnimeGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
};
