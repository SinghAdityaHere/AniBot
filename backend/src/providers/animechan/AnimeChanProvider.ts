import axios from 'axios';
import { AnimeQuote } from '@anibot/shared';
import { QuoteProvider } from '../QuoteProvider';
import { config } from '../../config';

const FALLBACK_QUOTES: AnimeQuote[] = [
  {
    id: 'fb_1',
    quote: "If you don't take risks, you can't create a future.",
    character: 'Monkey D. Luffy',
    animeTitle: 'One Piece',
  },
  {
    id: 'fb_2',
    quote: 'People’s lives don’t end when they die. It ends when they lose faith.',
    character: 'Itachi Uchiha',
    animeTitle: 'Naruto',
  },
  {
    id: 'fb_3',
    quote: 'In order to gain something, you must lose something of equal value.',
    character: 'Edward Elric',
    animeTitle: 'Fullmetal Alchemist',
  },
  {
    id: 'fb_4',
    quote: 'Hard work is worthless for those that don’t believe in themselves.',
    character: 'Naruto Uzumaki',
    animeTitle: 'Naruto',
  },
  {
    id: 'fb_5',
    quote: 'Fear is not evil. It tells you what your weakness is.',
    character: 'Gildarts Clive',
    animeTitle: 'Fairy Tail',
  },
];

export class AnimeChanProvider implements QuoteProvider {
  public name = 'animechan';

  public async getRandomQuote(): Promise<AnimeQuote> {
    try {
      const res = await axios.get(`${config.animeChanUrl}/quotes/random`, {
        timeout: 5000,
      });

      const data = res.data?.data || res.data;
      if (data && data.quote) {
        return {
          id: `ac_${Date.now()}`,
          quote: data.quote,
          character: data.character,
          animeTitle: data.anime,
        };
      }
    } catch (err: any) {
      console.warn('[AnimeChanProvider] API unavailable, using fallback quote:', err?.message);
    }

    // Fallback gracefully
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }

  public async getQuotesByAnime(title: string): Promise<AnimeQuote[]> {
    try {
      const res = await axios.get(`${config.animeChanUrl}/quotes/anime`, {
        params: { title },
        timeout: 5000,
      });

      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 5).map((item: any, idx: number) => ({
          id: `ac_q_${idx}_${Date.now()}`,
          quote: item.quote,
          character: item.character,
          animeTitle: item.anime || title,
        }));
      }
    } catch (err: any) {
      console.warn('[AnimeChanProvider] API getQuotesByAnime error:', err?.message);
    }

    // Return matching fallbacks or empty array gracefully
    const matching = FALLBACK_QUOTES.filter(
      (q) => q.animeTitle?.toLowerCase().includes(title.toLowerCase())
    );
    return matching;
  }
}
