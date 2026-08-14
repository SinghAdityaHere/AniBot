import { useQuery } from '@tanstack/react-query';
import { Anime } from '@anibot/shared';
import { fetchApi } from './client';

export function useAnimeSearch(query: string, page = 1) {
  return useQuery<Anime[]>({
    queryKey: ['anime', 'search', query, page],
    queryFn: () => fetchApi<Anime[]>(`/api/v1/anime/search?q=${encodeURIComponent(query)}&page=${page}`),
    enabled: !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnimeDetail(id?: string) {
  return useQuery<Anime>({
    queryKey: ['anime', 'detail', id],
    queryFn: () => fetchApi<Anime>(`/api/v1/anime/${id}`),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}
