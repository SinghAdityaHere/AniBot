import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useTrendingAnime,
  useCurrentlyAiring,
  useUpcomingAnime,
  useTopManga,
} from '../api/discover';
import { ContentRail } from '../components/discovery/ContentRail';
import { SurpriseMe } from '../components/discovery/SurpriseMe';
import { SearchBar } from '../components/ui/SearchBar';
import { Flame, Star, Tv, BookOpen, Sparkles, Compass } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: trendingAnime = [], isLoading: isTrendingLoading } = useTrendingAnime();
  const { data: currentlyAiring = [], isLoading: isAiringLoading } = useCurrentlyAiring();
  const { data: upcomingAnime = [], isLoading: isUpcomingLoading } = useUpcomingAnime();
  const { data: topManga = [], isLoading: isTopMangaLoading } = useTopManga();

  const handleSearch = (q: string) => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Discovery Hero Header */}
      <section style={{ textAlign: 'center', paddingTop: 16 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent)',
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          <Compass size={16} /> Discovery Portal
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', marginBottom: 12 }}>
          Discover Your Next Favorite Story
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto 28px auto' }}>
          Explore curated trending anime, currently airing shows, upcoming seasons, and top rated manga series.
        </p>
        <SearchBar onSearch={handleSearch} placeholder="Search anything... e.g. One Piece, Solo Leveling, Attack on Titan" />
      </section>

      {/* Surprise Me Box */}
      <SurpriseMe />

      {/* Trending Anime Rail */}
      <ContentRail
        title="🔥 Trending Anime"
        icon={<Flame size={22} color="#EF4444" />}
        items={trendingAnime}
        mediaType="anime"
        isLoading={isTrendingLoading}
        onViewAll={() => navigate('/search?type=anime')}
      />

      {/* Currently Airing Rail */}
      <ContentRail
        title="📺 Currently Airing"
        icon={<Tv size={22} color="var(--color-accent)" />}
        items={currentlyAiring}
        mediaType="anime"
        isLoading={isAiringLoading}
        onViewAll={() => navigate('/search?type=anime')}
      />

      {/* Top Manga Rail */}
      <ContentRail
        title="📖 Top Rated Manga"
        icon={<BookOpen size={22} color="var(--color-score)" />}
        items={topManga}
        mediaType="manga"
        isLoading={isTopMangaLoading}
        onViewAll={() => navigate('/manga')}
      />

      {/* Upcoming Season Rail */}
      <ContentRail
        title="✨ Upcoming Season"
        icon={<Sparkles size={22} color="var(--color-accent)" />}
        items={upcomingAnime}
        mediaType="anime"
        isLoading={isUpcomingLoading}
        onViewAll={() => navigate('/search?type=anime')}
      />
    </div>
  );
};
