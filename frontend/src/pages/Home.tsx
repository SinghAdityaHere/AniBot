import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { RandomQuote } from '../components/quotes/RandomQuote';
import { FactCard } from '../components/facts/FactCard';
import { useRecentSearches, useRecentSearchMutations } from '../api/recentSearches';
import { useFavourites } from '../api/favourites';
import { useAnimeSearch } from '../api/anime';
import { useMangaSearch } from '../api/manga';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { MangaGrid } from '../components/manga/MangaGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { X, Heart, Sparkles, Flame, Award, Zap, BookOpen } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentSearches = [] } = useRecentSearches();
  const { deleteSearch } = useRecentSearchMutations();
  const { data: favourites = [] } = useFavourites();

  // Curated anime & manga feeds from live APIs
  const { data: trendingAnime = [], isLoading: isTrendingLoading } = useAnimeSearch('Demon Slayer');
  const { data: actionAnime = [], isLoading: isActionLoading } = useAnimeSearch('Jujutsu Kaisen');
  const { data: topRatedAnime = [], isLoading: isTopLoading } = useAnimeSearch('Attack on Titan');

  // Featured Manga Feed
  const { data: featuredManga = [], isLoading: isMangaLoading } = useMangaSearch('Berserk');

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
          Discover Anime & Manga
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'var(--color-text-secondary)',
            marginBottom: 28,
            maxWidth: 620,
            marginInline: 'auto',
          }}
        >
          Explore thousands of Anime titles, Manga series, Quotes & Trivia
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

      {/* Anime Trivia / Fact & Quote Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={20} color="var(--color-accent)" />
            <h3 style={{ fontSize: 18 }}>Anime Quote</h3>
          </div>
          <RandomQuote />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={20} color="var(--color-score)" />
            <h3 style={{ fontSize: 18 }}>Anime Fact</h3>
          </div>
          <FactCard />
        </div>
      </section>

      {/* Trending Anime */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Flame size={22} color="#EF4444" />
          <h2 style={{ fontSize: 22 }}>Trending Anime</h2>
        </div>
        {isTrendingLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={trendingAnime.slice(0, 8)} />
        )}
      </section>

      {/* Featured Manga Series */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={22} color="var(--color-accent)" />
            <h2 style={{ fontSize: 22 }}>Popular Manga Series</h2>
          </div>
          <button onClick={() => navigate('/manga')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)' }}>
            View All Manga →
          </button>
        </div>
        {isMangaLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <MangaGrid mangas={featuredManga.slice(0, 8)} />
        )}
      </section>

      {/* Action & Shounen Hits */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Zap size={22} color="var(--color-score)" />
          <h2 style={{ fontSize: 22 }}>Action Hits</h2>
        </div>
        {isActionLoading ? (
          <AnimeGridSkeleton count={4} />
        ) : (
          <AnimeGrid animes={actionAnime.slice(0, 8)} />
        )}
      </section>
    </div>
  );
};
