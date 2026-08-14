import { useQuery } from '@tanstack/react-query';
import { Manga } from '@anibot/shared';
import { fetchApi } from './client';

export function useMangaSearch(query: string, page = 1) {
  return useQuery<Manga[]>({
    queryKey: ['manga', 'search', query, page],
    queryFn: () => fetchApi<Manga[]>(`/api/v1/manga/search?q=${encodeURIComponent(query)}&page=${page}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMangaDetail(id?: string) {
  return useQuery<Manga>({
    queryKey: ['manga', 'detail', id],
    queryFn: () => fetchApi<Manga>(`/api/v1/manga/${id}`),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}
