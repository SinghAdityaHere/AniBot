import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { MangaGrid } from '../components/manga/MangaGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { useAnimeSearch } from '../api/anime';
import { useMangaSearch } from '../api/manga';
import { useRecentSearchMutations } from '../api/recentSearches';
import { Tv, BookOpen, Layers } from 'lucide-react';
import { Anime, Manga } from '@anibot/shared';

type SearchTab = 'all' | 'anime' | 'manga';

// Helper to prioritize exact title matches
function prioritizeExactMatch<T extends { title: string }>(items: T[], query: string): T[] {
  if (!query || !query.trim()) return items;
  const q = query.trim().toLowerCase();
  const sorted = [...items];
  sorted.sort((a, b) => {
    const aExact = a.title.toLowerCase() === q;
    const bExact = b.title.toLowerCase() === q;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    const aStartsWith = a.title.toLowerCase().startsWith(q);
    const bStartsWith = b.title.toLowerCase().startsWith(q);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    return 0;
  });
  return sorted;
}

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const tabParam = (searchParams.get('type') as SearchTab) || 'all';

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<SearchTab>(tabParam);

  const isAnimeEnabled = activeTab === 'all' || activeTab === 'anime';
  const isMangaEnabled = activeTab === 'all' || activeTab === 'manga';

  const {
    data: rawAnimeResults = [],
    isLoading: isAnimeLoading,
    isError: isAnimeError,
    refetch: refetchAnime,
  } = useAnimeSearch(isAnimeEnabled ? queryParam : '');

  const {
    data: rawMangaResults = [],
    isLoading: isMangaLoading,
    isError: isMangaError,
    refetch: refetchManga,
  } = useMangaSearch(isMangaEnabled ? queryParam : '');

  const { addSearch } = useRecentSearchMutations();

  useEffect(() => {
    setQuery(queryParam);
    setActiveTab(tabParam);
    if (queryParam.trim()) {
      addSearch({ query: queryParam.trim(), mediaType: tabParam });
    }
  }, [queryParam, tabParam]);

  const handleSearchSubmit = (newQuery: string, type: SearchTab = activeTab) => {
    const trimmed = newQuery.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed, type });
    } else {
      setSearchParams({});
    }
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    if (queryParam.trim()) {
      setSearchParams({ q: queryParam.trim(), type: tab });
    }
  };

  const animeResults = prioritizeExactMatch(rawAnimeResults, queryParam);
  const mangaResults = prioritizeExactMatch(rawMangaResults, queryParam);

  const isLoading = (isAnimeEnabled && isAnimeLoading) || (isMangaEnabled && isMangaLoading);
  const isError = (isAnimeEnabled && isAnimeError) || (isMangaEnabled && isMangaError);
  const hasNoResults =
    queryParam.trim().length > 0 &&
    !isLoading &&
    !isError &&
    ((activeTab === 'all' && animeResults.length === 0 && mangaResults.length === 0) ||
      (activeTab === 'anime' && animeResults.length === 0) ||
      (activeTab === 'manga' && mangaResults.length === 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Unified Search</h1>
        <SearchBar
          value={query}
          onChange={(v) => setQuery(v)}
          onSearch={(v, type) => handleSearchSubmit(v, type || activeTab)}
          searchType={activeTab}
          autoFocus={!queryParam}
        />
      </div>

      {/* Search Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--color-border-light)', paddingBottom: 12 }}>
        <button
          onClick={() => handleTabChange('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: activeTab === 'all' ? 'var(--color-accent)' : 'var(--bg-secondary)',
            color: activeTab === 'all' ? '#ffffff' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Layers size={16} /> All
        </button>
        <button
          onClick={() => handleTabChange('anime')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: activeTab === 'anime' ? 'var(--color-accent)' : 'var(--bg-secondary)',
            color: activeTab === 'anime' ? '#ffffff' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Tv size={16} /> Anime {queryParam && !isAnimeLoading && `(${animeResults.length})`}
        </button>
        <button
          onClick={() => handleTabChange('manga')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 18px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: 14,
            backgroundColor: activeTab === 'manga' ? 'var(--color-accent)' : 'var(--bg-secondary)',
            color: activeTab === 'manga' ? '#ffffff' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <BookOpen size={16} /> Manga {queryParam && !isMangaLoading && `(${mangaResults.length})`}
        </button>
      </div>

      {queryParam && (
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {isLoading ? `Searching for "${queryParam}"...` : `Results for "${queryParam}"`}
        </div>
      )}

      {isLoading && <AnimeGridSkeleton count={8} />}

      {isError && (
        <ErrorState
          message="Failed to fetch search results from APIs."
          onRetry={() => {
            if (isAnimeEnabled) refetchAnime();
            if (isMangaEnabled) refetchManga();
          }}
        />
      )}

      {hasNoResults && (
        <EmptyState
          title="No Results Found"
          description={`No ${activeTab === 'all' ? 'anime or manga' : activeTab} found matching "${queryParam}". Check spelling or try a broader keyword.`}
        />
      )}

      {!isLoading && !isError && queryParam && (
        <>
          {/* Anime Section */}
          {(activeTab === 'all' || activeTab === 'anime') && animeResults.length > 0 && (
            <section>
              {activeTab === 'all' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Tv size={20} color="var(--color-accent)" />
                  <h2 style={{ fontSize: 20 }}>ANIME</h2>
                </div>
              )}
              <AnimeGrid animes={animeResults} />
            </section>
          )}

          {/* Manga Section */}
          {(activeTab === 'all' || activeTab === 'manga') && mangaResults.length > 0 && (
            <section style={{ marginTop: activeTab === 'all' ? 24 : 0 }}>
              {activeTab === 'all' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <BookOpen size={20} color="var(--color-score)" />
                  <h2 style={{ fontSize: 20 }}>MANGA</h2>
                </div>
              )}
              <MangaGrid mangas={mangaResults} />
            </section>
          )}
        </>
      )}

      {!queryParam && !isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
          Type any anime or manga title in the search bar above to explore titles.
        </div>
      )}
    </div>
  );
};
