import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { RandomQuote } from '../components/quotes/RandomQuote';
import { useRecentSearches, useRecentSearchMutations } from '../api/recentSearches';
import { useFavourites } from '../api/favourites';
import { useAnimeSearch } from '../api/anime';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { X, Heart, Sparkles, Flame, Award, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentSearches = [] } = useRecentSearches();
  const { deleteSearch } = useRecentSearchMutations();
  const { data: favourites = [] } = useFavourites();

  // Curated category feeds from live API
  const { data: trendingAnime = [], isLoading: isTrendingLoading } = useAnimeSearch('Demon Slayer');
  const { data: actionAnime = [], isLoading: isActionLoading } = useAnimeSearch('Jujutsu Kaisen');
  const { data: topRatedAnime = [], isLoading: isTopLoading } = useAnimeSearch('Attack on Titan');

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 16 }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', marginBottom: 12 }}>
          Discover Your Next Anime
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'var(--color-text-secondary)',
            marginBottom: 28,
            maxWidth: 580,
            marginInline: 'auto',
          }}
        >
          Explore thousands of anime titles powered by unified live API data. Fast, clean, and interactive.
        </p>

        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Recent Searches Chips */}
      {recentSearches.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
            <Heart size={22} color="var(--color-accent)" fill="var(--color-accent)" />
            <h2 style={{ fontSize: 22 }}>Your Favourites</h2>
          </div>
          <AnimeGrid animes={favourites.slice(0, 4).map((f) => f.animeData)} />
        </section>
      )}

      {/* Daily Quote Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sparkles size={22} color="var(--color-accent)" />
          <h2 style={{ fontSize: 22 }}>Anime Quote of the Day</h2>
        </div>
        <RandomQuote />
      </section>

      {/* Trending Now */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Flame size={22} color="#EF4444" />
          <h2 style={{ fontSize: 22 }}>Trending Now</h2>
        </div>
        {isTrendingLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={trendingAnime.slice(0, 8)} />
        )}
      </section>

      {/* Action & Shounen Hits */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={22} color="var(--color-score)" />
          <h2 style={{ fontSize: 22 }}>Action & Shounen Hits</h2>
        </div>
        {isActionLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={actionAnime.slice(0, 8)} />
        )}
      </section>

      {/* Top Rated Classics */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Award size={22} color="var(--color-accent)" />
          <h2 style={{ fontSize: 22 }}>Top Rated Classics</h2>
        </div>
        {isTopLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={topRatedAnime.slice(0, 8)} />
        )}
      </section>
    </div>
  );
};
