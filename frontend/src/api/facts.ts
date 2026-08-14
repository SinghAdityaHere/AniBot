import { useQuery } from '@tanstack/react-query';
import { AnimeFact } from '@anibot/shared';
import { fetchApi } from './client';
import { fetchDirectRandomFact } from './directApi';

export function useRandomFact() {
  return useQuery<AnimeFact>({
    queryKey: ['fact', 'random'],
    queryFn: async () => {
      try {
        return await fetchApi<AnimeFact>('/api/v1/facts/random');
      } catch {
        return await fetchDirectRandomFact();
      }
    },
    staleTime: 60 * 60 * 1000,
  });
}
