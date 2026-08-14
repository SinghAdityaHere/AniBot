import axios from 'axios';
import { AnimeQuote } from '@anibot/shared';
import { QuoteProvider } from '../QuoteProvider';
import { config } from '../../config';

export class AnimeChanProvider implements QuoteProvider {
  public name = 'animechan';

  public async getRandomQuote(): Promise<AnimeQuote> {
    // Primary Endpoint: AnimeChan API
    try {
      const res = await axios.get(`${config.animeChanUrl}/quotes/random`, {
        timeout: 6000,
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
      console.warn(`[AnimeChanProvider] Primary API error (${err?.message}), trying secondary live quote API...`);
    }

    // Secondary Live API Endpoint: animechan.xyz API
    try {
      const res = await axios.get('https://animechan.xyz/api/random', {
        timeout: 6000,
      });

      if (res.data && res.data.quote) {
        return {
          id: `ac_xyz_${Date.now()}`,
          quote: res.data.quote,
          character: res.data.character,
          animeTitle: res.data.anime,
        };
      }
    } catch (err: any) {
      console.warn(`[AnimeChanProvider] Secondary quote API error (${err?.message}), trying Quotable API...`);
    }

    // Tertiary Live API Endpoint: Quotable API
    try {
      const res = await axios.get('https://api.quotable.io/quotes/random?tags=wisdom|inspirational', {
        timeout: 6000,
      });

      const item = Array.isArray(res.data) ? res.data[0] : res.data;
      if (item && item.content) {
        return {
          id: `quotable_${item._id || Date.now()}`,
          quote: item.content,
          character: item.author,
          animeTitle: 'Inspirational Quote',
        };
      }
    } catch (err: any) {
      console.warn(`[AnimeChanProvider] Quotable API error: ${err?.message}`);
    }

    throw new Error('All live quote APIs are currently unavailable');
  }

  public async getQuotesByAnime(title: string): Promise<AnimeQuote[]> {
    try {
      const res = await axios.get(`${config.animeChanUrl}/quotes/anime`, {
        params: { title },
        timeout: 6000,
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
      console.warn(`[AnimeChanProvider] API getQuotesByAnime error: ${err?.message}`);
    }

    // Secondary live endpoint query by anime title
    try {
      const res = await axios.get(`https://animechan.xyz/api/quotes/anime`, {
        params: { title },
        timeout: 6000,
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data.slice(0, 5).map((item: any, idx: number) => ({
          id: `ac_xyz_q_${idx}_${Date.now()}`,
          quote: item.quote,
          character: item.character,
          animeTitle: item.anime || title,
        }));
      }
    } catch (err: any) {
      console.warn(`[AnimeChanProvider] Secondary quotes by anime error: ${err?.message}`);
    }

    return [];
  }
}
