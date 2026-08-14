import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMangaDetail, useMangaSearch } from '../api/manga';
import { MangaGrid } from '../components/manga/MangaGrid';
import { AnimeHeroSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { ChevronRight, Star, BookOpen, Layers } from 'lucide-react';

export const MangaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: manga, isLoading, isError, refetch } = useMangaDetail(id);

  const { data: relatedManga = [] } = useMangaSearch('Berserk');

  if (isLoading) return <AnimeHeroSkeleton />;
  if (isError || !manga) return <ErrorState message="Could not load details for this manga." onRetry={refetch} />;

  const altTitles = manga.alternativeTitles || [];
  const authors = manga.authors || [];
  const filteredRelated = relatedManga.filter((m) => m.id !== manga.id).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/manga">Manga</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{manga.title}</span>
      </div>

      {/* Manga Detail Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)', maxWidth: 320, aspectRatio: '2/3' }}>
          <img src={manga.image || 'https://via.placeholder.com/400x600?text=No+Cover'} alt={manga.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, marginBottom: 4 }}>{manga.title}</h1>
            {altTitles.length > 0 && (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
                {altTitles.slice(0, 3).join(' • ')}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {manga.type && (
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                {manga.type}
              </span>
            )}
            {manga.status && (
              <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-pill)', backgroundColor: manga.status.toLowerCase().includes('finish') ? '#e6f4ea' : 'var(--bg-secondary)', color: manga.status.toLowerCase().includes('finish') ? '#137333' : 'var(--color-text-primary)' }}>
                {manga.status}
              </span>
            )}
            {manga.score && (
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-score)', display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#fffbeb', padding: '4px 12px', borderRadius: 'var(--radius-pill)' }}>
                <Star size={16} fill="var(--color-score)" color="var(--color-score)" />
                {manga.score.toFixed(1)} / 10
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
            {manga.chapters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={16} color="var(--color-accent)" />
                <span><strong>Chapters:</strong> {manga.chapters}</span>
              </div>
            )}
            {manga.volumes && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="var(--color-accent)" />
                <span><strong>Volumes:</strong> {manga.volumes}</span>
              </div>
            )}
          </div>

          {authors.length > 0 && (
            <div>
              <strong style={{ fontSize: 13 }}>Author / Artist:</strong>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                {authors.map((a) => a.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {manga.description && (
        <section>
          <h3 style={{ fontSize: 20, marginBottom: 12 }}>Synopsis</h3>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-line' }}>
            {manga.description}
          </p>
        </section>
      )}

      {/* Recommendations */}
      {filteredRelated.length > 0 && (
        <section>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>Popular Manga Recommendations</h3>
          <MangaGrid mangas={filteredRelated} />
        </section>
      )}
    </div>
  );
};
