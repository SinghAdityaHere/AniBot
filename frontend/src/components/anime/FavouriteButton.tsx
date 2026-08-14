import React from 'react';
import { Heart } from 'lucide-react';
import { Anime } from '@anibot/shared';
import { useFavourites, useToggleFavourite } from '../../api/favourites';
import { useLibrary } from '../../api/library';

interface FavouriteButtonProps {
  anime: Anime;
  overlay?: boolean;
}

export const FavouriteButton: React.FC<FavouriteButtonProps> = ({ anime, overlay = false }) => {
  const { data: favourites = [] } = useFavourites();
  const { data: library = [] } = useLibrary();
  const { addFavourite, removeFavourite, isLoading } = useToggleFavourite();

  const isFav =
    favourites.some((f) => f.animeId === anime.id) ||
    library.some((item) => item.mediaId === anime.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLoading) return;

    if (isFav) {
      removeFavourite(anime.id);
    } else {
      addFavourite({ animeId: anime.id, animeData: anime });
    }
  };

  const label = isFav ? `Remove ${anime.title} from favourites` : `Add ${anime.title} to favourites`;

  if (overlay) {
    return (
      <button
        type="button"
        className={`favourite-btn-overlay ${isFav ? 'is-favourite' : ''}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={label}
        title={label}
      >
        <Heart size={18} fill={isFav ? 'var(--color-accent)' : 'none'} color={isFav ? 'var(--color-accent)' : '#666666'} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 24px',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: isFav ? 'var(--color-accent-light)' : 'var(--color-accent)',
        color: isFav ? 'var(--color-accent)' : '#ffffff',
        fontWeight: 600,
        fontSize: 14,
        border: isFav ? '1px solid var(--color-accent)' : 'none',
        transition: 'all var(--transition-fast)',
      }}
    >
      <Heart size={18} fill={isFav ? 'var(--color-accent)' : 'none'} color={isFav ? 'var(--color-accent)' : '#ffffff'} />
      {isFav ? 'Favourited' : 'Add to Favourites'}
    </button>
  );
};
