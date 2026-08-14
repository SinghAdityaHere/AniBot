import React, { useState } from 'react';
import { useFavourites } from '../api/favourites';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { SearchBar } from '../components/ui/SearchBar';
import { Heart } from 'lucide-react';

export const FavouritesPage: React.FC = () => {
  const { data: favourites = [], isLoading } = useFavourites();
  const [filterQuery, setFilterQuery] = useState('');

  const favAnimes = favourites.map((f) => f.animeData);
  const filtered = favAnimes.filter((a) =>
    a.title.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Heart size={28} color="var(--color-accent)" fill="var(--color-accent)" />
          <h1 style={{ fontSize: 28 }}>Your Favourites</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
          {favourites.length} {favourites.length === 1 ? 'anime' : 'animes'} saved in your list
        </p>
      </div>

      {favourites.length > 0 && (
        <SearchBar
          value={filterQuery}
          onChange={(v) => setFilterQuery(v)}
          placeholder="Filter favourites by title..."
        />
      )}

      {isLoading && <AnimeGridSkeleton count={4} />}

      {!isLoading && favourites.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
          <Heart size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            No Favourites Yet
          </h3>
          <p style={{ fontSize: 14 }}>
            Click the heart icon on any anime card to add it to your favourites list.
          </p>
        </div>
      )}

      {!isLoading && favourites.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-secondary)' }}>
          No favourites matching "{filterQuery}".
        </div>
      )}

      {!isLoading && filtered.length > 0 && <AnimeGrid animes={filtered} />}
    </div>
  );
};
