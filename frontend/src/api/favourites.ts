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
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (animeId: string) => {
      try {
        return await fetchApi<{ removed: boolean }>(`/api/v1/favourites/${animeId}`, {
          method: 'DELETE',
        });
      } catch {
        removeLocalFavourite(animeId);
        return { removed: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  return {
    addFavourite: addMutation.mutateAsync,
    removeFavourite: removeMutation.mutateAsync,
    isLoading: addMutation.isPending || removeMutation.isPending,
  };
}
