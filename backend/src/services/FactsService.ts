import { AnimeFact } from '@anibot/shared';
import { AnimeFactsProvider } from '../providers/facts/AnimeFactsProvider';
import { CacheService } from '../cache/CacheService';

export class FactsService {
  private static provider = new AnimeFactsProvider();
  private static TTL = 24 * 60 * 60 * 1000;

  public static async getRandomFact(): Promise<{ fact: AnimeFact; cached: boolean }> {
    const cacheKey = 'fact_random_latest';
    const cached = await CacheService.get<AnimeFact>(cacheKey);

    if (cached) {
      return { fact: cached, cached: true };
    }

    const fact = await this.provider.getRandomFact();
    if (fact) {
      await CacheService.set(cacheKey, fact, 'anime_facts', this.TTL);
    }

    return { fact, cached: false };
  }
}
