import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Favourite, Anime } from '@anibot/shared';
import { fetchApi } from './client';

export function useFavourites() {
  return useQuery<Favourite[]>({
    queryKey: ['favourites'],
    queryFn: () => fetchApi<Favourite[]>('/api/v1/favourites'),
  });
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: ({ animeId, animeData }: { animeId: string; animeData: Anime }) =>
      fetchApi<Favourite>('/api/v1/favourites', {
        method: 'POST',
        body: JSON.stringify({ animeId, animeData }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (animeId: string) =>
      fetchApi<{ removed: boolean }>(`/api/v1/favourites/${animeId}`, {
        method: 'DELETE',
      }),
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
