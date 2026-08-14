import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LibraryItem, LibraryCategory, Anime, Manga } from '@anibot/shared';
import { fetchApi } from './client';
import {
  getStoredLibraryItems,
  saveStoredLibraryItem,
  removeStoredLibraryItem,
  updateStoredLibraryCategory,
} from '../services/storage';

import { useFavourites } from './favourites';

export function useLibrary() {
  const { data: favourites = [] } = useFavourites();

  return useQuery<LibraryItem[]>({
    queryKey: ['library', favourites.length],
    queryFn: async () => {
      let stored = getStoredLibraryItems();

      // Merge any items from useFavourites() query into stored library
      const existingMediaIds = new Set(stored.map((item) => item.mediaId || item.id));

      favourites.forEach((f) => {
        const mediaId = f.animeId || f.animeData?.id;
        if (mediaId && !existingMediaIds.has(mediaId)) {
          stored.unshift({
            id: f.id || `lib_${mediaId}`,
            mediaId,
            mediaType: 'anime',
            title: f.animeData?.title || 'Saved Anime',
            image: f.animeData?.image,
            score: f.animeData?.score,
            status: f.animeData?.status,
            category: 'favourited',
            addedAt: f.createdAt || new Date().toISOString(),
            mediaData: f.animeData,
          });
          existingMediaIds.add(mediaId);
        }
      });

      return stored;
    },
  });
}

export function useLibraryMutations() {
  const queryClient = useQueryClient();

  const addItem = useMutation({
    mutationFn: async ({
      mediaData,
      mediaType,
      category,
    }: {
      mediaData: Anime | Manga;
      mediaType: 'anime' | 'manga';
      category?: LibraryCategory;
    }) => {
      try {
        return await fetchApi<LibraryItem>('/api/v1/library', {
          method: 'POST',
          body: JSON.stringify({ mediaData, mediaType, category }),
        });
      } catch {
        return saveStoredLibraryItem(mediaData, mediaType, category);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library'] });
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (mediaId: string) => {
      // 1. Send DELETE to both favourites endpoint and library endpoint on backend SQLite
      try {
        await fetchApi<{ removed: boolean }>(`/api/v1/favourites/${mediaId}`, { method: 'DELETE' });
      } catch {}
      try {
        await fetchApi<{ removed: boolean }>(`/api/v1/library/${mediaId}`, { method: 'DELETE' });
      } catch {}

      // 2. Wipe from local storage
      removeStoredLibraryItem(mediaId);
      return { removed: true, mediaId };
    },
    onSuccess: (_, mediaId) => {
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
      const targetClean = cleanId(mediaId);

      queryClient.setQueriesData<LibraryItem[]>({ queryKey: ['library'] }, (old) => {
        if (!old) return [];
        return old.filter(
          (item) =>
            cleanId(item.mediaId) !== targetClean &&
            cleanId(item.id) !== targetClean &&
            cleanId(item.mediaData?.id) !== targetClean
        );
      });

      queryClient.setQueriesData<any[]>({ queryKey: ['favourites'] }, (old) => {
        if (!old) return [];
        return old.filter(
          (f) =>
            cleanId(f.animeId) !== targetClean &&
            cleanId(f.animeData?.id) !== targetClean &&
            cleanId(f.id) !== targetClean
        );
      });

      queryClient.invalidateQueries({ queryKey: ['library'] });
      queryClient.invalidateQueries({ queryKey: ['favourites'] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      mediaId,
      category,
    }: {
      mediaId: string;
      category: LibraryCategory;
    }) => {
      const res = updateStoredLibraryCategory(mediaId, category);
      try {
        await fetchApi<LibraryItem>(`/api/v1/library/${mediaId}/category`, {
          method: 'PATCH',
          body: JSON.stringify({ category }),
        });
      } catch {}
      return res || { mediaId, category };
    },
    onSuccess: (_, { mediaId, category }) => {
      queryClient.setQueriesData<LibraryItem[]>({ queryKey: ['library'] }, (old) => {
        if (!old) return [];
        return old.map((item) => {
          if (item.mediaId === mediaId || item.id === mediaId || item.mediaData?.id === mediaId) {
            return { ...item, category };
          }
          return item;
        });
      });
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });

  return {
    addItem: addItem.mutateAsync,
    removeItem: removeItem.mutate,
    updateCategory: updateCategory.mutate,
    isLoading: addItem.isPending || removeItem.isPending || updateCategory.isPending,
  };
}
