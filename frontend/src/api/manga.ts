import { useQuery } from '@tanstack/react-query';
import { Manga } from '@anibot/shared';
import { fetchApi } from './client';
import { fetchDirectMangaSearch, fetchDirectMangaDetail } from './directApi';

export function useMangaSearch(query: string, page = 1) {
  return useQuery<Manga[]>({
    queryKey: ['manga', 'search', query, page],
    queryFn: async () => {
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
