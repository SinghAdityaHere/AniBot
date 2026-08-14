import { Anime } from '@anibot/shared';
import { ProviderRegistry } from '../providers/ProviderRegistry';
import { CacheService } from '../cache/CacheService';

export class AnimeService {
  private static SEARCH_TTL = 10 * 60 * 1000; // 10 minutes
  private static DETAIL_TTL = 12 * 60 * 60 * 1000; // 12 hours

  public static async search(query: string, page = 1): Promise<{ results: Anime[]; cached: boolean }> {
    const cacheKey = `search_${query.toLowerCase().trim()}_p${page}`;
    const cached = await CacheService.get<Anime[]>(cacheKey);

    if (cached) {
      return { results: cached, cached: true };
    }

    const provider = ProviderRegistry.getPrimaryAnimeProvider();
    const results = await provider.search(query, page);

    if (results.length > 0) {
      await CacheService.set(cacheKey, results, provider.name, this.SEARCH_TTL);
    }

    return { results, cached: false };
  }

  public static async getById(id: string): Promise<{ anime: Anime | null; cached: boolean }> {
    const cacheKey = `detail_${id}`;
    const cached = await CacheService.get<Anime>(cacheKey);

    if (cached) {
      return { anime: cached, cached: true };
    }

    const provider = ProviderRegistry.getPrimaryAnimeProvider();
    const anime = await provider.getById(id);

    if (anime) {
      await CacheService.set(cacheKey, anime, provider.name, this.DETAIL_TTL);
    }

    return { anime, cached: false };
  }
}
