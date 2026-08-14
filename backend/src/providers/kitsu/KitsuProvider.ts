import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { KitsuNormalizer } from './KitsuNormalizer';
import { config } from '../../config';

export class KitsuProvider implements AnimeProvider {
  public name = 'kitsu';

  public async search(query: string, page = 1): Promise<Anime[]> {
    try {
      const offset = (page - 1) * 20;
      const params: Record<string, any> = {
        'page[limit]': 20,
        'page[offset]': offset,
      };

      if (query && query.trim()) {
        params['filter[text]'] = query;
      } else {
        params['sort'] = '-userCount'; // Top popular anime
      }

      const response = await axios.get(`${config.kitsuUrl}/anime`, {
        params,
        timeout: 10000,
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });

      const data = response.data?.data || [];
      return data.map((item: any) => KitsuNormalizer.normalize(item));
    } catch (error: any) {
      console.warn(`[KitsuProvider] Live API search failed: ${error?.message}`);
      return [];
    }
  }

  public async getById(id: string): Promise<Anime | null> {
    try {
      const rawId = id.replace('kitsu_', '').replace('mal_', '');
      const response = await axios.get(`${config.kitsuUrl}/anime/${rawId}`, {
        timeout: 10000,
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });

      const item = response.data?.data;
      if (!item) return null;
      return KitsuNormalizer.normalize(item);
    } catch (error: any) {
      console.warn(`[KitsuProvider] Live API getById failed: ${error?.message}`);
      return null;
    }
  }
}
