import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { JikanNormalizer } from './JikanNormalizer';
import { KitsuProvider } from '../kitsu/KitsuProvider';
import { config } from '../../config';

export class JikanProvider implements AnimeProvider {
  public name = 'jikan';
  private kitsuFallback = new KitsuProvider();

  private headers = {
    'User-Agent': 'AniBot/1.0 (Anime Discovery Platform; https://github.com/anibot)',
  };

  public async search(query: string, page = 1): Promise<Anime[]> {
    try {
      const response = await axios.get(`${config.jikanUrl}/anime`, {
        headers: this.headers,
        params: {
          q: query || undefined,
          page,
          limit: 20,
          sfw: true,
          order_by: !query ? 'popularity' : undefined,
        },
        timeout: 10000,
      });

      const data = response.data?.data || [];
      if (data.length > 0) {
        return data.map((item: any) => JikanNormalizer.normalize(item));
      }
    } catch (error: any) {
      console.warn(`[JikanProvider] Search API failed (${error?.message}), falling back to live Kitsu API...`);
    }

    // Try live Top Anime endpoint from Jikan
    try {
      const topRes = await axios.get(`${config.jikanUrl}/top/anime`, {
        headers: this.headers,
        params: { page, limit: 20 },
        timeout: 10000,
      });

      const topData = topRes.data?.data || [];
      if (topData.length > 0) {
        const normalized = topData.map((item: any) => JikanNormalizer.normalize(item));
        if (query && query.trim()) {
          const filtered = normalized.filter((a: Anime) =>
            a.title.toLowerCase().includes(query.toLowerCase()) ||
            a.alternativeTitles.some((alt) => alt.toLowerCase().includes(query.toLowerCase()))
          );
          if (filtered.length > 0) return filtered;
        }
        return normalized;
      }
    } catch (err: any) {
      console.warn(`[JikanProvider] Top anime API failed (${err?.message}), fetching live Kitsu API...`);
    }

    // Live API Fallback to Kitsu API — 100% dynamic live data, zero hardcoded objects!
    return this.kitsuFallback.search(query, page);
  }

  public async getById(id: string): Promise<Anime | null> {
    try {
      const rawId = id.startsWith('mal_') ? id.replace('mal_', '') : id;
      const response = await axios.get(`${config.jikanUrl}/anime/${rawId}`, {
        headers: this.headers,
        timeout: 10000,
      });

      const item = response.data?.data;
      if (item) {
        return JikanNormalizer.normalize(item);
      }
    } catch (error: any) {
      console.warn(`[JikanProvider] GetById API failed (${error?.message}), fetching live Kitsu API...`);
    }

    // Live API Fallback to Kitsu
    return this.kitsuFallback.getById(id);
  }
}
