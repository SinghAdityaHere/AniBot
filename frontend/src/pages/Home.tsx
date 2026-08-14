import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { RandomQuote } from '../components/quotes/RandomQuote';
import { useRecentSearches, useRecentSearchMutations } from '../api/recentSearches';
import { useFavourites } from '../api/favourites';
import { useAnimeSearch } from '../api/anime';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { X, Heart, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentSearches = [] } = useRecentSearches();
  const { deleteSearch } = useRecentSearchMutations();
  const { data: favourites = [] } = useFavourites();
  const { data: trendingAnime = [], isLoading: isTrendingLoading } = useAnimeSearch('Demon Slayer');

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 16 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: 12 }}>
          Discover Your Next Anime
        </h1>
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--color-text-secondary)',
            marginBottom: 32,
            maxWidth: 600,
            marginInline: 'auto',
          }}
        >
          Search millions of titles powered by unified anime data layer. Clean, fast, and simple.
        </p>

        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Recent Searches Chips */}
      {recentSearches.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent Searches
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {recentSearches.slice(0, 8).map((item) => (
              <div key={item.id} className="chip" onClick={() => handleSearch(item.query)}>
                <span>{item.query}</span>
                <span
                  className="chip-dismiss"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSearch(item.id);
                  }}
                  title="Remove search"
                >
                  <X size={14} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favourites Section */}
      {favourites.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Heart size={20} color="var(--color-accent)" fill="var(--color-accent)" />
            <h2 style={{ fontSize: 22 }}>Your Favourites</h2>
          </div>
          <AnimeGrid animes={favourites.slice(0, 4).map((f) => f.animeData)} />
        </section>
      )}

      {/* Daily Quote Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sparkles size={20} color="var(--color-accent)" />
          <h2 style={{ fontSize: 22 }}>Anime Quote of the Day</h2>
        </div>
        <RandomQuote />
      </section>

      {/* Trending / Recommended Grid */}
      <section>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Popular Anime</h2>
        {isTrendingLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={trendingAnime.slice(0, 8)} />
        )}
      </section>
    </div>
  );
};
