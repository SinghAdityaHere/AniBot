import { AnimeQuote } from '@anibot/shared';

export interface QuoteProvider {
  name: string;
  getRandomQuote(): Promise<AnimeQuote>;
  getQuotesByAnime(title: string): Promise<AnimeQuote[]>;
}
