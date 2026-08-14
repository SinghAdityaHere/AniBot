import React, { useState } from 'react';
import { useMangaSearch } from '../api/manga';
import { MangaGrid } from '../components/manga/MangaGrid';
import { AnimeGridSkeleton } from '../components/ui/Skeleton';
import { SearchBar } from '../components/ui/SearchBar';
import { BookOpen } from 'lucide-react';

export const MangaExplorerPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { data: mangas = [], isLoading } = useMangaSearch(query);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <BookOpen size={28} color="var(--color-accent)" />
          <h1 style={{ fontSize: 28 }}>Manga Explorer</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 20 }}>
          Discover top rated Manga, Manhwa, and Light Novels powered by MyAnimeList, Kitsu & MangaDex.
        </p>

        <SearchBar
          value={query}
          onChange={(v) => setQuery(v)}
          placeholder="Search manga by title... e.g. Berserk, One Piece, Solo Leveling"
        />
      </div>

      {isLoading ? (
        <AnimeGridSkeleton count={8} />
      ) : mangas.length > 0 ? (
        <MangaGrid mangas={mangas} />
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-secondary)' }}>
          {query ? `No manga titles found matching "${query}".` : 'Loading popular manga...'}
        </div>
      )}
    </div>
  );
};
