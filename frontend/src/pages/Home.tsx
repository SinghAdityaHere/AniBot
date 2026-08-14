import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { RandomQuote } from '../components/quotes/RandomQuote';
import { FactCard } from '../components/facts/FactCard';
import { useRecentSearches, useRecentSearchMutations } from '../api/recentSearches';
import { useRecentlyViewed, useRecentlyViewedMutations } from '../api/recentlyViewed';
import { useTrendingAnime, useCurrentlyAiring, useTopManga } from '../api/discover';
import { ContentRail } from '../components/discovery/ContentRail';
import { SurpriseMe } from '../components/discovery/SurpriseMe';
import { X, Sparkles, Flame, Tv, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: recentSearches = [] } = useRecentSearches();
  const { deleteSearch } = useRecentSearchMutations();
  const { data: recentlyViewed = [] } = useRecentlyViewed();
  const { removeView } = useRecentlyViewedMutations();

  // Curated anime & manga feeds from live APIs
  const { data: trendingAnime = [], isLoading: isTrendingLoading } = useTrendingAnime();
  const { data: currentlyAiring = [], isLoading: isAiringLoading } = useCurrentlyAiring();
  const { data: topManga = [], isLoading: isMangaLoading } = useTopManga();

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

      {/* Continue Exploring (Recently Viewed) */}
      {recentlyViewed.length > 0 && (
        <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px 24px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={20} color="var(--color-accent)" />
              <h2 style={{ fontSize: 20 }}>Continue Exploring</h2>
            </div>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Recently Viewed</span>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 8 }}>
            {recentlyViewed.slice(0, 10).map((rv) => (
              <div
                key={rv.mediaId}
                onClick={() => navigate(rv.mediaType === 'anime' ? `/anime/${rv.mediaId}` : `/manga/${rv.mediaId}`)}
                style={{
                  flex: '0 0 160px',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeView(rv.mediaId);
                  }}
                  title="Remove from recently viewed"
                  aria-label="Remove from recently viewed"
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    zIndex: 10,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
                <img
                  src={rv.image || 'https://via.placeholder.com/160x220?text=Cover'}
                  alt={rv.title}
                  style={{ width: '100%', height: 120, objectFit: 'cover' }}
                />
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={rv.title}>
                    {rv.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>
                    {rv.mediaType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Surprise Me Feature */}
      <SurpriseMe />

      {/* Trending Anime Rail */}
      <ContentRail
        title="Trending Anime"
        icon={<Flame size={22} color="#EF4444" />}
        items={trendingAnime}
        mediaType="anime"
        isLoading={isTrendingLoading}
        onViewAll={() => navigate('/discover')}
      />

      {/* Currently Airing Rail */}
      <ContentRail
        title="Currently Airing"
        icon={<Tv size={22} color="var(--color-accent)" />}
        items={currentlyAiring}
        mediaType="anime"
        isLoading={isAiringLoading}
        onViewAll={() => navigate('/discover')}
      />

      {/* Popular Manga Rail */}
      <ContentRail
        title="Popular Manga Series"
        icon={<BookOpen size={22} color="var(--color-score)" />}
        items={topManga}
        mediaType="manga"
        isLoading={isMangaLoading}
        onViewAll={() => navigate('/manga')}
      />

      {/* Anime Quote & Fact Grid */}
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
    </div>
  );
};
