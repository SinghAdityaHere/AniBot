import axios from 'axios';
import { Manga } from '@anibot/shared';
import { MangaProvider } from './MangaProvider';
import { config } from '../../config';

export class JikanMangaProvider implements MangaProvider {
  public name = 'jikan_manga';

  private headers = {
    'User-Agent': 'AniBot/1.0 (Anime & Manga Discovery Platform)',
  };

  public async searchManga(query: string, page = 1): Promise<Manga[]> {
    try {
      const response = await axios.get(`${config.jikanUrl}/manga`, {
        headers: this.headers,
        params: {
          q: query || undefined,
          page,
          limit: 20,
          order_by: !query ? 'popularity' : undefined,
        },
        timeout: 10000,
      });

      const items = response.data?.data || [];
      if (items.length > 0) {
        return items.map((item: any) => this.normalizeJikanManga(item));
      }
    } catch (err: any) {
      console.warn(`[JikanMangaProvider] Search API error (${err?.message}), trying Kitsu Manga API...`);
    }

    // Secondary Live API: Kitsu Manga API
    try {
      const offset = (page - 1) * 20;
      const res = await axios.get(`${config.kitsuUrl}/manga`, {
        params: {
          'filter[text]': query || undefined,
          'page[limit]': 20,
          'page[offset]': offset,
          sort: !query ? '-userCount' : undefined,
        },
        timeout: 10000,
      });

      const data = res.data?.data || [];
      return data.map((item: any) => this.normalizeKitsuManga(item));
    } catch (err: any) {
      console.warn(`[JikanMangaProvider] Kitsu Manga API fallback error: ${err?.message}`);
      return [];
    }
  }

  public async getMangaById(id: string): Promise<Manga | null> {
    const rawId = id.replace('manga_', '').replace('mal_', '').replace('kitsu_', '');

    try {
      const response = await axios.get(`${config.jikanUrl}/manga/${rawId}`, {
        headers: this.headers,
        timeout: 10000,
      });

      const item = response.data?.data;
      if (item) {
        return this.normalizeJikanManga(item);
      }
    } catch (err: any) {
      console.warn(`[JikanMangaProvider] getMangaById API error (${err?.message}), trying Kitsu Manga API...`);
    }

    // Try Kitsu Manga API
    try {
      const res = await axios.get(`${config.kitsuUrl}/manga/${rawId}`, {
        timeout: 10000,
      });

      const item = res.data?.data;
      if (item) {
        return this.normalizeKitsuManga(item);
      }
    } catch (err: any) {
      console.warn(`[JikanMangaProvider] Kitsu getMangaById error: ${err?.message}`);
    }

    return null;
  }

  private normalizeJikanManga(item: any): Manga {
    const altTitles: string[] = [];
    if (item.title_english) altTitles.push(item.title_english);
    if (item.title_japanese) altTitles.push(item.title_japanese);

    return {
      id: `manga_${item.mal_id}`,
      title: item.title || 'Unknown Manga Title',
      alternativeTitles: altTitles,
      description: item.synopsis || undefined,
      image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
      year: item.published?.from ? new Date(item.published.from).getFullYear() : undefined,
      status: item.status,
      type: item.type || 'Manga',
      chapters: item.chapters || undefined,
      volumes: item.volumes || undefined,
      score: item.score || undefined,
      genres: (item.genres || []).map((g: any) => ({ id: g.mal_id, name: g.name })),
      authors: (item.authors || []).map((a: any) => ({ id: a.mal_id, name: a.name })),
      publishedInfo: item.published?.string,
      externalIds: {
        jikan: String(item.mal_id),
      },
    };
  }

  private normalizeKitsuManga(item: any): Manga {
    const attr = item.attributes || {};
    return {
      id: `kitsu_manga_${item.id}`,
      title: attr.canonicalTitle || attr.en_jp || 'Unknown Manga',
      alternativeTitles: attr.titles ? Object.values(attr.titles).filter((t): t is string => typeof t === 'string') : [],
      description: attr.synopsis || undefined,
      image: attr.posterImage?.large || attr.posterImage?.medium,
      year: attr.startDate ? new Date(attr.startDate).getFullYear() : undefined,
      status: attr.status === 'finished' ? 'Finished' : attr.status === 'current' ? 'Publishing' : attr.status,
      type: attr.mangaType ? attr.mangaType.toUpperCase() : 'Manga',
      chapters: attr.chapterCount || undefined,
      volumes: attr.volumeCount || undefined,
      score: attr.averageRating ? parseFloat(attr.averageRating) / 10 : undefined,
      genres: [],
      authors: [],
      publishedInfo: attr.startDate ? `${attr.startDate} to ${attr.endDate || 'Present'}` : undefined,
      externalIds: {
        kitsu: item.id,
      },
    };
  }
}
