import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { AniDBNormalizer } from './AniDBNormalizer';
import { config } from '../../config';

export class AniDBProvider implements AnimeProvider {
  public name = 'anidb';

  public async search(query: string, page = 1): Promise<Anime[]> {
    if (!query || !query.trim()) return [];

    try {
      // Live API query to Kitsu/AniDB open HTTP metadata endpoint
      const response = await axios.get(`${config.kitsuUrl}/anime`, {
        params: {
          'filter[text]': query,
          'page[limit]': 10,
        },
        timeout: 8000,
        headers: {
          Accept: 'application/vnd.api+json',
        },
      });

      const items = response.data?.data || [];
      return items.map((item: any) =>
        AniDBNormalizer.normalize({
          id: item.id,
          anidbId: item.id,
          title: item.attributes?.canonicalTitle,
          titles: Object.values(item.attributes?.titles || {}),
          type: item.attributes?.showType?.toUpperCase() || 'TV',
          picture: item.attributes?.posterImage?.medium,
        })
      );
    } catch (err: any) {
      console.warn(`[AniDBProvider] Live search API error: ${err?.message}`);
      return [];
    }
  }

  public async getById(id: string): Promise<Anime | null> {
    const rawId = id.replace('anidb_', '').replace('mal_', '').replace('kitsu_', '');
    try {
      const response = await axios.get(`${config.kitsuUrl}/anime/${rawId}`, {
        timeout: 8000,
        headers: {
          Accept: 'application/vnd.api+json',
        },
      });

      const item = response.data?.data;
      if (!item) return null;

      return AniDBNormalizer.normalize({
        id: item.id,
        anidbId: item.id,
        title: item.attributes?.canonicalTitle,
        titles: Object.values(item.attributes?.titles || {}),
        type: item.attributes?.showType?.toUpperCase() || 'TV',
        picture: item.attributes?.posterImage?.medium,
      });
    } catch (err: any) {
      console.warn(`[AniDBProvider] Live getById API error: ${err?.message}`);
      return null;
    }
  }
}
