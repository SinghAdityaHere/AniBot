import { Anime } from '@anibot/shared';
import { ProviderRegistry } from '../providers/ProviderRegistry';
import { CacheService } from '../cache/CacheService';
import { AniDBNormalizer } from '../providers/anidb/AniDBNormalizer';
import { prisma } from '../db';

export class AnimeService {
  private static SEARCH_TTL = 10 * 60 * 1000; // 10 minutes
  private static DETAIL_TTL = 12 * 60 * 60 * 1000; // 12 hours

  public static async search(query: string, page = 1): Promise<{ results: Anime[]; cached: boolean }> {
    const cacheKey = `search_${query.toLowerCase().trim()}_p${page}`;
    const cached = await CacheService.get<Anime[]>(cacheKey);

    if (cached) {
      return { results: cached, cached: true };
    }

    const primaryProvider = ProviderRegistry.getPrimaryAnimeProvider();
    let results = await primaryProvider.search(query, page);

    if (results.length === 0) {
      const secondaryProvider = ProviderRegistry.getSecondaryAnimeProvider();
      results = await secondaryProvider.search(query, page);
    }

    if (results.length > 0) {
      await CacheService.set(cacheKey, results, primaryProvider.name, this.SEARCH_TTL);
    }

    return { results, cached: false };
  }

  public static async getById(id: string): Promise<{ anime: Anime | null; cached: boolean }> {
    const cacheKey = `detail_${id}`;
    const cached = await CacheService.get<Anime>(cacheKey);

    if (cached) {
      return { anime: cached, cached: true };
    }

    const primaryProvider = ProviderRegistry.getPrimaryAnimeProvider();
    let anime = await primaryProvider.getById(id);

    if (anime) {
      // Phase 2: Perform AniDB enrichment safely without blocking
      try {
        const secondaryProvider = ProviderRegistry.getSecondaryAnimeProvider();
        const aniDbEnrichment = await secondaryProvider.getById(id);

        if (aniDbEnrichment) {
          anime = AniDBNormalizer.enrich(anime, aniDbEnrichment);

          // Populate ProviderMapping table in background DB
          if (aniDbEnrichment.externalIds.aniDb && anime.externalIds.jikan) {
            await prisma.providerMapping.upsert({
              where: {
                provider_providerId: {
                  provider: 'anidb',
                  providerId: aniDbEnrichment.externalIds.aniDb,
                },
              },
              create: {
                canonicalAnimeId: anime.id,
                provider: 'anidb',
                providerId: aniDbEnrichment.externalIds.aniDb,
              },
              update: {
                canonicalAnimeId: anime.id,
              },
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('[AnimeService] AniDB enrichment skipped:', err);
      }

      await CacheService.set(cacheKey, anime, primaryProvider.name, this.DETAIL_TTL);
    }

    return { anime, cached: false };
  }
}
