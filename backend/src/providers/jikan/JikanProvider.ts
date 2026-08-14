import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { JikanNormalizer } from './JikanNormalizer';
import { config } from '../../config';
import { ProviderError } from '../../utils/errors';

export class JikanProvider implements AnimeProvider {
  public name = 'jikan';

  public async search(query: string, page = 1): Promise<Anime[]> {
    try {
      const response = await axios.get(`${config.jikanUrl}/anime`, {
        params: {
          q: query,
          page,
          limit: 20,
          sfw: true,
        },
        timeout: 10000,
      });

      const data = response.data?.data || [];
      return data.map((item: any) => JikanNormalizer.normalize(item));
    } catch (error: any) {
      console.error('[JikanProvider] Search error:', error?.message);
      throw new ProviderError(`Jikan search failed: ${error?.message}`, this.name);
    }
  }

  public async getById(id: string): Promise<Anime | null> {
    try {
      const rawId = id.startsWith('mal_') ? id.replace('mal_', '') : id;
      const response = await axios.get(`${config.jikanUrl}/anime/${rawId}`, {
        timeout: 10000,
      });

      const item = response.data?.data;
      if (!item) return null;
      return JikanNormalizer.normalize(item);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('[JikanProvider] GetById error:', error?.message);
      throw new ProviderError(`Jikan getById failed: ${error?.message}`, this.name);
    }
  }
}
