import { useQuery } from '@tanstack/react-query';
import { Manga } from '@anibot/shared';
import { fetchApi } from './client';
import {
  fetchDirectMangaSearch,
  fetchDirectMangaDetail,
  fetchDirectMangaRelations,
  fetchDirectMangaRecommendations,
  isStaticHost,
} from './directApi';

export function useMangaSearch(query: string, page = 1) {
  return useQuery<Manga[]>({
    queryKey: ['manga', 'search', query, page],
    queryFn: async () => {
      if (isStaticHost()) {
        return await fetchDirectMangaSearch(query, page);
      }
      try {
        return await fetchApi<Manga[]>(`/api/v1/manga/search?q=${encodeURIComponent(query)}&page=${page}`);
      } catch (err) {
        console.warn('[useMangaSearch] Backend API unreachable, executing Direct Browser Manga API query...');
        return await fetchDirectMangaSearch(query, page);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useMangaDetail(id?: string) {
  return useQuery<Manga>({
    queryKey: ['manga', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('Manga ID required');
      
      if (isStaticHost()) {
        const res = await fetchDirectMangaDetail(id);
        if (res) return res;
        throw new Error('Manga not found');
      }

      try {
        return await fetchApi<Manga>(`/api/v1/manga/${id}`);
      } catch (err) {
        console.warn('[useMangaDetail] Backend API unreachable, executing Direct Browser Manga API detail fetch...');
        const res = await fetchDirectMangaDetail(id);
        if (!res) throw new Error('Manga not found');
        return res;
      }
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}

export function useMangaRelations(id?: string) {
  return useQuery<any[]>({
    queryKey: ['manga', 'relations', id],
    queryFn: async () => {
      if (!id) return [];
      try {
        return await fetchApi<any[]>(`/api/v1/manga/${id}/relations`);
      } catch {
        return await fetchDirectMangaRelations(id);
      }
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}

export function useMangaRecommendations(id?: string) {
  return useQuery<Manga[]>({
    queryKey: ['manga', 'recommendations', id],
    queryFn: async () => {
      if (!id) return [];
      try {
        return await fetchApi<Manga[]>(`/api/v1/manga/${id}/recommendations`);
      } catch {
        return await fetchDirectMangaRecommendations(id);
      }
    },
    enabled: !!id,
    staleTime: 60 * 60 * 1000,
  });
}
