import { Manga } from '@anibot/shared';
import { JikanMangaProvider } from '../providers/manga/JikanMangaProvider';
import { MangaDexProvider } from '../providers/manga/MangaDexProvider';
import { CacheService } from '../cache/CacheService';

export class MangaService {
  private static jikanManga = new JikanMangaProvider();
  private static mangaDex = new MangaDexProvider();
  private static CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

  public static async searchManga(query: string, page = 1): Promise<{ results: Manga[]; cached: boolean }> {
    const cacheKey = `manga_search_${(query || 'popular').toLowerCase().trim()}_p${page}`;
    const cached = await CacheService.get<Manga[]>(cacheKey);

    if (cached) {
      return { results: cached, cached: true };
    }

    // Try primary provider (Jikan / MyAnimeList Manga)
    let results = await this.jikanManga.searchManga(query, page);

    // If empty, try secondary provider (MangaDex)
    if (results.length === 0) {
      results = await this.mangaDex.searchManga(query, page);
    }

    if (results.length > 0) {
      await CacheService.set(cacheKey, results, 'manga', this.CACHE_TTL);
    }

    return { results, cached: false };
  }

  public static async getMangaById(id: string): Promise<{ manga: Manga | null; cached: boolean }> {
    const cacheKey = `manga_detail_${id}`;
    const cached = await CacheService.get<Manga>(cacheKey);

    if (cached) {
      return { manga: cached, cached: true };
    }

    let manga = await this.jikanManga.getMangaById(id);
    if (!manga) {
      manga = await this.mangaDex.getMangaById(id);
    }

    if (manga) {
      await CacheService.set(cacheKey, manga, 'manga', this.CACHE_TTL);
    }

    return { manga, cached: false };
  }
}
