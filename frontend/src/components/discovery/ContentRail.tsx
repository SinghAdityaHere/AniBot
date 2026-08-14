import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime, Manga } from '@anibot/shared';
import { AnimeCard } from '../anime/AnimeCard';
import { MangaCard } from '../manga/MangaCard';
import { AnimeCardSkeleton } from '../ui/Skeleton';

interface ContentRailProps {
  title: string;
  icon?: React.ReactNode;
  items: (Anime | Manga)[];
  mediaType: 'anime' | 'manga' | 'mixed';
  isLoading?: boolean;
  viewAllLink?: string;
  onViewAll?: () => void;
}

export const ContentRail: React.FC<ContentRailProps> = ({
  title,
  icon,
  items,
  mediaType,
  isLoading = false,
  onViewAll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon}
          <h2 style={{ fontSize: 22 }}>{title}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onViewAll && (
            <button
              onClick={onViewAll}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--color-accent)',
                marginRight: 8,
              }}
            >
              View All →
            </button>
          )}

          <button
            onClick={() => handleScroll('left')}
            className="rail-nav-btn"
            aria-label={`Scroll ${title} left`}
            title="Scroll left"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="rail-nav-btn"
            aria-label={`Scroll ${title} right`}
            title="Scroll right"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-primary)',
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', gap: 20, overflow: 'hidden' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ flex: '0 0 210px' }}>
              <AnimeCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: 20,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: 8,
          }}
        >
          {items.map((item) => {
            const isMangaItem =
              mediaType === 'manga' ||
              item.id.startsWith('manga_') ||
              item.id.startsWith('mangadex_') ||
              item.id.startsWith('kitsu_manga_');

            return (
              <div key={item.id} style={{ flex: '0 0 210px', scrollSnapAlign: 'start' }}>
                {isMangaItem ? (
                  <MangaCard manga={item as Manga} />
                ) : (
                  <AnimeCard anime={item as Anime} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
