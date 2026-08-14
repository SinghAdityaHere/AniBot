import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnimeDetail, useAnimeSearch } from '../api/anime';
import { useAnimeQuotes } from '../api/quotes';
import { AnimeHero } from '../components/anime/AnimeHero';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { AnimeCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { QuoteCard } from '../components/quotes/QuoteCard';
import { ChevronRight, ExternalLink, Quote as QuoteIcon } from 'lucide-react';

export const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading, isError, refetch } = useAnimeDetail(id);

  const { data: quotes = [], isLoading: isQuotesLoading } = useAnimeQuotes(anime?.title);

  // Recommendations: search by first genre if available
  const genreQuery = anime?.genres?.[0]?.name || 'Action';
  const { data: relatedAnime = [] } = useAnimeSearch(genreQuery);

  if (isLoading) {
    return (
      <div style={{ padding: '32px 0' }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-md)', marginBottom: 24 }} />
      </div>
    );
  }

  if (isError || !anime) {
    return <ErrorState message="Could not load details for this anime." onRetry={refetch} />;
  }

  const filteredRelated = relatedAnime.filter((a) => a.id !== anime.id).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Breadcrumb Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: 'var(--color-text-secondary)',
        }}
      >
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/search">Search</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{anime.title}</span>
      </div>

      {/* Hero Section */}
      <AnimeHero anime={anime} />

      {/* Synopsis / Description */}
      {anime.description && (
        <section>
          <h3 style={{ fontSize: 20, marginBottom: 12 }}>Synopsis</h3>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: 'var(--color-text-primary)',
              whiteSpace: 'pre-line',
            }}
          >
            {anime.description}
          </p>
        </section>
      )}

      {/* Quotes Section (AnimeChan API / Fallback) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <QuoteIcon size={20} color="var(--color-accent)" />
          <h3 style={{ fontSize: 20 }}>Famous Quotes</h3>
        </div>

        {isQuotesLoading ? (
          <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
        ) : quotes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {quotes.map((q) => (
              <QuoteCard key={q.id} quote={q} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 20,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--color-text-secondary)',
              fontSize: 14,
            }}
          >
            No quotes available for {anime.title} right now.
          </div>
        )}
      </section>

      {/* Related Anime Section */}
      {filteredRelated.length > 0 && (
        <section>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>
            More in {genreQuery}
          </h3>
          <AnimeGrid animes={filteredRelated} />
        </section>
      )}

      {/* External Data Provider Mapping IDs */}
      <section
        style={{
          borderTop: '1px solid var(--color-border-light)',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 13,
          color: 'var(--color-text-muted)',
        }}
      >
        <span>Provider Identifiers:</span>
        {anime.externalIds.jikan && (
          <a
            href={`https://myanimelist.net/anime/${anime.externalIds.jikan}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            MyAnimeList (MAL #{anime.externalIds.jikan}) <ExternalLink size={12} />
          </a>
        )}
      </section>
    </div>
  );
};
