import { useQuery } from '@tanstack/react-query';
import { AnimeQuote } from '@anibot/shared';
import { fetchApi } from './client';
import { fetchDirectRandomQuote, fetchDirectAnimeQuotes } from './directApi';

export function useRandomQuote() {
  return useQuery<AnimeQuote>({
    queryKey: ['quote', 'random'],
    queryFn: async () => {
      try {
        return await fetchApi<AnimeQuote>('/api/v1/quotes/random');
      } catch {
        return await fetchDirectRandomQuote();
      }
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useAnimeQuotes(title?: string) {
  return useQuery<AnimeQuote[]>({
    queryKey: ['quote', 'anime', title],
    queryFn: async () => {
      if (!title) return [];
      try {
        return await fetchApi<AnimeQuote[]>(`/api/v1/quotes/anime?title=${encodeURIComponent(title)}`);
      } catch {
        return await fetchDirectAnimeQuotes(title);
      }
    },
    enabled: !!title && title.trim().length > 0,
    staleTime: 60 * 60 * 1000,
  });
}
