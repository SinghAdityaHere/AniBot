import { AnimeProvider } from './AnimeProvider';
import { QuoteProvider } from './QuoteProvider';
import { JikanProvider } from './jikan/JikanProvider';
import { AnimeChanProvider } from './animechan/AnimeChanProvider';

export class ProviderRegistry {
  private static animeProviders: AnimeProvider[] = [new JikanProvider()];
  private static quoteProviders: QuoteProvider[] = [new AnimeChanProvider()];

  public static getPrimaryAnimeProvider(): AnimeProvider {
    return this.animeProviders[0];
  }

  public static getPrimaryQuoteProvider(): QuoteProvider {
    return this.quoteProviders[0];
  }
}
