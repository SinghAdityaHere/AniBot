import { useQuery } from '@tanstack/react-query';
import { Anime, Manga } from '@anibot/shared';
import { fetchApi } from './client';
import {
  fetchDirectTrendingAnime,
  fetchDirectCurrentlyAiring,
  fetchDirectUpcomingAnime,
  fetchDirectTopManga,
  fetchDirectRandomAnime,
  fetchDirectRandomManga,
  isStaticHost,
} from './directApi';

export function useTrendingAnime() {
  return useQuery<Anime[]>({
    queryKey: ['discover', 'trending-anime'],
    queryFn: async () => {
      if (isStaticHost()) return await fetchDirectTrendingAnime();
      try {
        return await fetchApi<Anime[]>('/api/v1/discover/trending-anime');
      } catch {
        return await fetchDirectTrendingAnime();
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useCurrentlyAiring() {
  return useQuery<Anime[]>({
    queryKey: ['discover', 'currently-airing'],
    queryFn: async () => {
      if (isStaticHost()) return await fetchDirectCurrentlyAiring();
      try {
        return await fetchApi<Anime[]>('/api/v1/discover/currently-airing');
      } catch {
        return await fetchDirectCurrentlyAiring();
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useUpcomingAnime() {
  return useQuery<Anime[]>({
    queryKey: ['discover', 'upcoming-anime'],
    queryFn: async () => {
      if (isStaticHost()) return await fetchDirectUpcomingAnime();
      try {
        return await fetchApi<Anime[]>('/api/v1/discover/upcoming-anime');
      } catch {
        return await fetchDirectUpcomingAnime();
      }
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useTopManga() {
  return useQuery<Manga[]>({
    queryKey: ['discover', 'top-manga'],
    queryFn: async () => {
      if (isStaticHost()) return await fetchDirectTopManga();
      try {
        return await fetchApi<Manga[]>('/api/v1/discover/top-manga');
      } catch {
        return await fetchDirectTopManga();
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useRandomPick() {
  return useQuery<{ anime: Anime | null; manga: Manga | null }>({
    queryKey: ['discover', 'random-pick'],
    queryFn: async () => {
      const [anime, manga] = await Promise.all([
        fetchDirectRandomAnime(),
        fetchDirectRandomManga(),
      ]);
      return { anime, manga };
    },
    staleTime: 0,
  });
}
