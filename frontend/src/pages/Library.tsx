import React, { useState } from 'react';
import { useLibrary } from '../api/library';
import { LibraryCard } from '../components/library/LibraryCard';
import { LibraryListItem } from '../components/library/LibraryListItem';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { SearchBar } from '../components/ui/SearchBar';
import { Bookmark, LayoutGrid, List, Filter, ArrowUpDown } from 'lucide-react';
import { LibraryCategory } from '@anibot/shared';

type MediaTypeFilter = 'all' | 'anime' | 'manga';
type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'title' | 'score';

export const LibraryPage: React.FC = () => {
  const { data: library = [], isLoading } = useLibrary();

  const [mediaFilter, setMediaFilter] = useState<MediaTypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filtered = library.filter((item) => {
    if (mediaFilter !== 'all' && item.mediaType !== mediaFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim() && !item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
      return false;
    }
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === 'score') {
      return (b.score || 0) - (a.score || 0);
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Bookmark size={28} color="var(--color-accent)" />
            <h1 style={{ fontSize: 28 }}>My Library</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 15 }}>
            {library.length} {library.length === 1 ? 'title' : 'titles'} saved in your personal library
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <LayoutGrid size={16} /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: viewMode === 'list' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <List size={16} /> List
          </button>
        </div>
      </div>

      {/* Controls Bar: Search, Filters & Sorting */}
      {library.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchBar
            value={searchQuery}
            onChange={(v) => setSearchQuery(v)}
            placeholder="Search within your library..."
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            {/* Media Type Tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
              {(['all', 'anime', 'manga'] as MediaTypeFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMediaFilter(tab)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 600,
                    fontSize: 13,
                    textTransform: 'capitalize',
                    backgroundColor: mediaFilter === tab ? 'var(--color-accent-light)' : 'var(--bg-secondary)',
                    color: mediaFilter === tab ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dropdown Filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <Filter size={14} color="var(--color-text-muted)" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="favourited">Favourited</option>
                  <option value="watching">Watching</option>
                  <option value="reading">Reading</option>
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="plan_to_read">Plan to Read</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <ArrowUpDown size={14} color="var(--color-text-muted)" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--color-text-primary)',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <option value="recent">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="score">Score (High-Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && <AnimeGridSkeleton count={6} />}

      {!isLoading && library.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--color-text-secondary)' }}>
          <Bookmark size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            Your Library is Empty
          </h3>
          <p style={{ fontSize: 14 }}>
            Click the favourite or bookmark button on any anime or manga page to save it here.
          </p>
        </div>
      )}

      {!isLoading && library.length > 0 && sorted.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-secondary)' }}>
          No titles found matching your filter criteria.
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="anime-grid">
              {sorted.map((item) => (
                <LibraryCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sorted.map((item) => (
                <LibraryListItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
