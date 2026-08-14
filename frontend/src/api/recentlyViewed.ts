import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RecentlyViewed } from '@anibot/shared';
import { fetchApi } from './client';
import {
  getStoredRecentlyViewed,
  saveStoredRecentlyViewed,
  removeStoredRecentlyViewed,
  clearStoredRecentlyViewed,
} from '../services/storage';

export function useRecentlyViewed() {
  return useQuery<RecentlyViewed[]>({
    queryKey: ['recently-viewed'],
    queryFn: async () => {
      try {
        return await fetchApi<RecentlyViewed[]>('/api/v1/recently-viewed');
      } catch {
        return getStoredRecentlyViewed();
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useRecentlyViewedMutations() {
  const queryClient = useQueryClient();

  const recordView = useMutation({
    mutationFn: async ({
      mediaId,
      mediaType,
      title,
      image,
    }: {
      mediaId: string;
      mediaType: 'anime' | 'manga';
      title: string;
      image?: string;
    }) => {
      try {
        return await fetchApi<RecentlyViewed>('/api/v1/recently-viewed', {
          method: 'POST',
          body: JSON.stringify({ mediaId, mediaType, title, image }),
        });
      } catch {
        return saveStoredRecentlyViewed(mediaId, mediaType, title, image);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });

  const removeView = useMutation({
    mutationFn: async (mediaId: string) => {
      try {
        return await fetchApi<{ removed: boolean }>(`/api/v1/recently-viewed/${mediaId}`, {
          method: 'DELETE',
        });
      } catch {
        removeStoredRecentlyViewed(mediaId);
        return { removed: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });

  const clearViews = useMutation({
    mutationFn: async () => {
      try {
        return await fetchApi<{ cleared: boolean }>('/api/v1/recently-viewed', {
          method: 'DELETE',
        });
      } catch {
        clearStoredRecentlyViewed();
        return { cleared: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed'] });
    },
  });

  return {
    recordView: recordView.mutate,
    removeView: removeView.mutate,
    clearViews: clearViews.mutateAsync,
  };
}
