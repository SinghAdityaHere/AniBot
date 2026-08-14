import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Favourite, Anime } from '@anibot/shared';
import { fetchApi } from './client';
import { getLocalFavourites, saveLocalFavourite, removeLocalFavourite } from './directApi';

export function useFavourites() {
  return useQuery<Favourite[]>({
    queryKey: ['favourites'],
    queryFn: async () => {
      try {
        return await fetchApi<Favourite[]>('/api/v1/favourites');
      } catch {
        return getLocalFavourites();
      }
    },
  });
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async ({ animeId, animeData }: { animeId: string; animeData: Anime }) => {
      try {
        return await fetchApi<Favourite>('/api/v1/favourites', {
          method: 'POST',
          body: JSON.stringify({ animeId, animeData }),
        });
      } catch {
        return saveLocalFavourite(animeId, animeData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (animeId: string) => {
      try {
        await fetchApi<{ removed: boolean }>(`/api/v1/favourites/${animeId}`, {
          method: 'DELETE',
        });
      } catch {}
      removeLocalFavourite(animeId);
      return { removed: true, animeId };
    },
    onSuccess: (_, animeId) => {
      const cleanId = (candidate?: string | number) => {
        if (!candidate) return '';
        return String(candidate)
          .toLowerCase()
          .trim()
          .replace(/^lib_/, '')
          .replace(/^fav_/, '')
          .replace(/^mal_/, '')
          .replace(/^kitsu_manga_/, '')
          .replace(/^kitsu_/, '')
          .replace(/^mangadex_/, '')
          .replace(/^manga_/, '');
      };
      const targetClean = cleanId(animeId);

      queryClient.setQueriesData<any[]>({ queryKey: ['favourites'] }, (old) => {
        if (!old) return [];
        return old.filter(
          (f) =>
            cleanId(f.animeId) !== targetClean &&
            cleanId(f.animeData?.id) !== targetClean &&
            cleanId(f.id) !== targetClean
        );
      });

      queryClient.setQueriesData<any[]>({ queryKey: ['library'] }, (old) => {
        if (!old) return [];
        return old.filter(
          (item) =>
            cleanId(item.mediaId) !== targetClean &&
            cleanId(item.id) !== targetClean &&
            cleanId(item.mediaData?.id) !== targetClean
        );
      });

      queryClient.invalidateQueries({ queryKey: ['favourites'] });
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });

  return {
    addFavourite: addMutation.mutateAsync,
    removeFavourite: removeMutation.mutateAsync,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
