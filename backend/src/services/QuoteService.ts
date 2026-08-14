import { AnimeQuote } from '@anibot/shared';
import { ProviderRegistry } from '../providers/ProviderRegistry';
import { CacheService } from '../cache/CacheService';

export class QuoteService {
  private static QUOTE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  public static async getRandomQuote(): Promise<{ quote: AnimeQuote; cached: boolean }> {
    const cacheKey = 'quote_random_latest';
    const cached = await CacheService.get<AnimeQuote>(cacheKey);

    if (cached) {
      return { quote: cached, cached: true };
    }

    const provider = ProviderRegistry.getPrimaryQuoteProvider();
    const quote = await provider.getRandomQuote();

    if (quote) {
      await CacheService.set(cacheKey, quote, provider.name, this.QUOTE_TTL);
    }

    return { quote, cached: false };
  }

  public static async getQuotesByAnime(title: string): Promise<{ quotes: AnimeQuote[]; cached: boolean }> {
    const cacheKey = `quotes_anime_${title.toLowerCase().trim()}`;
    const cached = await CacheService.get<AnimeQuote[]>(cacheKey);

    if (cached) {
      return { quotes: cached, cached: true };
    }

    const provider = ProviderRegistry.getPrimaryQuoteProvider();
    const quotes = await provider.getQuotesByAnime(title);

    if (quotes && quotes.length > 0) {
      await CacheService.set(cacheKey, quotes, provider.name, this.QUOTE_TTL);
    }

    return { quotes: quotes || [], cached: false };
  }
}
