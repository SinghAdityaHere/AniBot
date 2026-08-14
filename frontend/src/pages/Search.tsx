import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { useAnimeSearch } from '../api/anime';
import { useRecentSearchMutations } from '../api/recentSearches';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);

  const { data: results, isLoading, isError, refetch } = useAnimeSearch(queryParam);
  const { addSearch } = useRecentSearchMutations();

  useEffect(() => {
    setQuery(queryParam);
    if (queryParam.trim()) {
      addSearch({ query: queryParam.trim() });
    }
  }, [queryParam]);

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Search Anime</h1>
        <SearchBar
          value={query}
          onChange={(v) => setQuery(v)}
          onSearch={handleSearchSubmit}
          autoFocus={!queryParam}
        />
      </div>

      {queryParam && (
        <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {isLoading
            ? `Searching for "${queryParam}"...`
            : results
            ? `${results.length} results found for "${queryParam}"`
            : ''}
        </div>
      )}

      {isLoading && <AnimeGridSkeleton count={8} />}

      {isError && <ErrorState message="Failed to fetch anime search results from API." onRetry={refetch} />}

      {!isLoading && !isError && queryParam && results && results.length === 0 && <EmptyState />}

      {!isLoading && !isError && results && results.length > 0 && <AnimeGrid animes={results} />}

      {!queryParam && !isLoading && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
          Type an anime title in the search box above to begin discovery.
        </div>
      )}
    </div>
  );
};
