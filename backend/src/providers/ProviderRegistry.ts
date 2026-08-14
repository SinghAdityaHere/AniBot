import { AnimeProvider } from './AnimeProvider';
import { QuoteProvider } from './QuoteProvider';
import { JikanProvider } from './jikan/JikanProvider';
import { AniDBProvider } from './anidb/AniDBProvider';
import { AnimeChanProvider } from './animechan/AnimeChanProvider';

export class ProviderRegistry {
  private static animeProviders: AnimeProvider[] = [new JikanProvider(), new AniDBProvider()];
  private static quoteProviders: QuoteProvider[] = [new AnimeChanProvider()];

  public static getPrimaryAnimeProvider(): AnimeProvider {
    return this.animeProviders[0];
  }

  public static getSecondaryAnimeProvider(): AnimeProvider {
    return this.animeProviders[1];
  }

  public static getPrimaryQuoteProvider(): QuoteProvider {
    return this.quoteProviders[0];
  }
}
