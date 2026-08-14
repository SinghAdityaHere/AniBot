import { useQuery } from '@tanstack/react-query';
import { Anime } from '@anibot/shared';
import { fetchApi } from './client';
import {
  fetchDirectAnimeSearch,
  fetchDirectAnimeDetail,
  fetchDirectAnimeRelations,
  fetchDirectAnimeRecommendations,
  isStaticHost,
} from './directApi';

export function useAnimeSearch(query: string, page = 1) {
  return useQuery<Anime[]>({
    queryKey: ['anime', 'search', query, page],
    queryFn: async () => {
      if (isStaticHost()) {
        return await fetchDirectAnimeSearch(query, page);
      }
      try {
        return await fetchApi<Anime[]>(`/api/v1/anime/search?q=${encodeURIComponent(query)}&page=${page}`);
      } catch (err) {
        console.warn('[useAnimeSearch] Backend API unreachable, executing Direct Browser API query...');
        return await fetchDirectAnimeSearch(query, page);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnimeDetail(id?: string) {
  return useQuery<Anime>({
    queryKey: ['anime', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Anime ID required');
      
      if (isStaticHost()) {
        const res = await fetchDirectAnimeDetail(id);
        if (res) return res;
        throw new Error('Anime not found');
      }

      try {
        return await fetchApi<Anime>(`/api/v1/anime/${id}`);
      } catch (err) {
        console.warn('[useAnimeDetail] Backend API unreachable, executing Direct Browser API detail fetch...');
        const res = await fetchDirectAnimeDetail(id);
        if (!res) throw new Error('Anime not found');
        return res;
      }
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAnimeRelations(id?: string) {
  return useQuery<any[]>({
    queryKey: ['anime', 'relations', id],
    queryFn: async () => {
      if (!id) return [];
      try {
        return await fetchApi<any[]>(`/api/v1/anime/${id}/relations`);
      } catch {
        return await fetchDirectAnimeRelations(id);
      }
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useAnimeRecommendations(id?: string) {
  return useQuery<Anime[]>({
    queryKey: ['anime', 'recommendations', id],
    queryFn: async () => {
      if (!id) return [];
      try {
        return await fetchApi<Anime[]>(`/api/v1/anime/${id}/recommendations`);
      } catch {
        return await fetchDirectAnimeRecommendations(id);
      }
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}
