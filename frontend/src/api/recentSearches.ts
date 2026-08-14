import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RecentSearch } from '@anibot/shared';
import { fetchApi } from './client';

export function useRecentSearches() {
  return useQuery<RecentSearch[]>({
    queryKey: ['recent-searches'],
    queryFn: () => fetchApi<RecentSearch[]>('/api/v1/recent-searches'),
  });
}

export function useRecentSearchMutations() {
  const queryClient = useQueryClient();

  const addSearch = useMutation({
    mutationFn: ({ query, animeId }: { query: string; animeId?: string }) =>
      fetchApi<RecentSearch>('/api/v1/recent-searches', {
        method: 'POST',
        body: JSON.stringify({ query, animeId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
    },
  });

  const deleteSearch = useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ deleted: boolean }>(`/api/v1/recent-searches/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
    },
  });

  const clearAllSearches = useMutation({
    mutationFn: () =>
      fetchApi<{ cleared: boolean }>('/api/v1/recent-searches', {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
    },
  });

  return {
    addSearch: addSearch.mutateAsync,
    deleteSearch: deleteSearch.mutateAsync,
    clearAllSearches: clearAllSearches.mutateAsync,
  };
}
