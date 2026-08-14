import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RecentSearch } from '@anibot/shared';
import { fetchApi } from './client';
import {
  getLocalRecentSearches,
  saveLocalRecentSearch,
  deleteLocalRecentSearch,
  clearLocalRecentSearches,
} from './directApi';

export function useRecentSearches() {
  return useQuery<RecentSearch[]>({
    queryKey: ['recent-searches'],
    queryFn: async () => {
      try {
        return await fetchApi<RecentSearch[]>('/api/v1/recent-searches');
      } catch {
        return getLocalRecentSearches();
      }
    },
  });
}

export function useRecentSearchMutations() {
  const queryClient = useQueryClient();

  const addSearch = useMutation({
    mutationFn: async ({
      query,
      animeId,
      mediaType,
    }: {
      query: string;
      animeId?: string;
      mediaType?: 'anime' | 'manga' | 'all';
    }) => {
      try {
        return await fetchApi<RecentSearch>('/api/v1/recent-searches', {
          method: 'POST',
          body: JSON.stringify({ query, animeId, mediaType }),
        });
      } catch {
        return saveLocalRecentSearch(query, animeId, mediaType);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
    },
  });

  const deleteSearch = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await fetchApi<{ deleted: boolean }>(`/api/v1/recent-searches/${id}`, {
          method: 'DELETE',
        });
      } catch {
        deleteLocalRecentSearch(id);
        return { deleted: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-searches'] });
    },
  });

  const clearAllSearches = useMutation({
    mutationFn: async () => {
      try {
        return await fetchApi<{ cleared: boolean }>('/api/v1/recent-searches', {
          method: 'DELETE',
        });
      } catch {
        clearLocalRecentSearches();
        return { cleared: true };
      }
    },
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
