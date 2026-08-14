import { useQuery } from '@tanstack/react-query';
import { AnimeFact } from '@anibot/shared';
import { fetchApi } from './client';

export function useRandomFact() {
  return useQuery<AnimeFact>({
    queryKey: ['fact', 'random'],
    queryFn: () => fetchApi<AnimeFact>('/api/v1/facts/random'),
    staleTime: 60 * 60 * 1000,
  });
}
