import axios from 'axios';
import { Manga } from '@anibot/shared';
import { MangaProvider } from './MangaProvider';

export class MangaDexProvider implements MangaProvider {
  public name = 'mangadex';

  public async searchManga(query: string, page = 1): Promise<Manga[]> {
    try {
      const offset = (page - 1) * 20;
      const params: Record<string, any> = {
        limit: 20,
        offset,
        'includes[]': ['cover_art', 'author'],
        'order[followedCount]': 'desc',
      };

      if (query && query.trim()) {
        params.title = query.trim();
      }

      const response = await axios.get('https://api.mangadex.org/manga', {
        params,
        timeout: 10000,
      });

      const items = response.data?.data || [];
      return items.map((item: any) => this.normalizeMangaDex(item));
    } catch (err: any) {
      console.warn(`[MangaDexProvider] Live MangaDex API error: ${err?.message}`);
      return [];
    }
  }

  public async getMangaById(id: string): Promise<Manga | null> {
    const rawId = id.replace('mangadex_', '');
    try {
      const response = await axios.get(`https://api.mangadex.org/manga/${rawId}`, {
        params: {
          'includes[]': ['cover_art', 'author'],
        },
        timeout: 10000,
      });

      const item = response.data?.data;
      if (!item) return null;
      return this.normalizeMangaDex(item);
    } catch (err: any) {
      console.warn(`[MangaDexProvider] MangaDex getMangaById error: ${err?.message}`);
      return null;
    }
  }

  private normalizeMangaDex(item: any): Manga {
    const attr = item.attributes || {};
    const title = attr.title?.en || attr.title?.ja || Object.values(attr.title || {})[0] || 'Unknown Manga';

    const altTitles: string[] = (attr.altTitles || [])
      .map((tObj: any) => Object.values(tObj)[0])
      .filter((t: any): t is string => typeof t === 'string' && t !== title);

    // Find cover art file from relationships
    const coverRel = (item.relationships || []).find((r: any) => r.type === 'cover_art');
    const coverFileName = coverRel?.attributes?.fileName;
    const coverUrl = coverFileName
      ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}.256.jpg`
      : undefined;

    // Find authors
    const authorRels = (item.relationships || []).filter((r: any) => r.type === 'author');
    const authors = authorRels.map((a: any, idx: number) => ({
      id: a.id || idx,
      name: a.attributes?.name || 'Author',
    }));

    return {
      id: `mangadex_${item.id}`,
      title,
      alternativeTitles: altTitles,
      description: attr.description?.en || Object.values(attr.description || {})[0] || undefined,
      image: coverUrl,
      year: attr.year || undefined,
      status: attr.status === 'completed' ? 'Finished' : attr.status === 'ongoing' ? 'Publishing' : attr.status,
      type: attr.originalLanguage === 'ja' ? 'Manga' : attr.originalLanguage === 'ko' ? 'Manhwa' : attr.originalLanguage === 'zh' ? 'Manhua' : 'Comic',
      score: undefined,
      genres: (attr.tags || []).map((t: any) => ({ id: t.id, name: t.attributes?.name?.en || 'Genre' })),
      authors,
      publishedInfo: attr.year ? String(attr.year) : undefined,
      externalIds: {
        mangaDex: item.id,
      },
    };
  }
}
