import { useQuery } from '@tanstack/react-query';
import { AnimeQuote } from '@anibot/shared';
import { fetchApi } from './client';

export function useRandomQuote() {
  return useQuery<AnimeQuote>({
    queryKey: ['quote', 'random'],
    queryFn: () => fetchApi<AnimeQuote>('/api/v1/quotes/random'),
    staleTime: 60 * 60 * 1000,
  });
}

export function useAnimeQuotes(title?: string) {
  return useQuery<AnimeQuote[]>({
    queryKey: ['quote', 'anime', title],
    queryFn: () => fetchApi<AnimeQuote[]>(`/api/v1/quotes/anime?title=${encodeURIComponent(title || '')}`),
    enabled: !!title && title.trim().length > 0,
    staleTime: 60 * 60 * 1000,
  });
}
