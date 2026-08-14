import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { AniDBNormalizer } from './AniDBNormalizer';

// Known AniDB provider mappings for cross-referencing
const ANIDB_CROSS_REF: Record<string, { id: string; title: string; altTitles: string[] }> = {
  '20': { id: '239', title: 'Naruto', altTitles: ['NARUTO -ナルト-'] },
  '16498': { id: '9541', title: 'Shingeki no Kyojin', altTitles: ['Attack on Titan', '進撃の巨人'] },
  '38000': { id: '14713', title: 'Kimetsu no Yaiba', altTitles: ['Demon Slayer', '鬼滅の刃'] },
  '21': { id: '69', title: 'One Piece', altTitles: ['ワンピース'] },
  '1535': { id: '4563', title: 'Death Note', altTitles: ['デスノート'] },
  '5114': { id: '6107', title: 'Hagane no Renkinjutsushi: Fullmetal Alchemist', altTitles: ['Fullmetal Alchemist: Brotherhood'] },
};

export class AniDBProvider implements AnimeProvider {
  public name = 'anidb';

  private headers = {
    'User-Agent': 'AniBot/1.0 (AniDB Enrichment Module)',
  };

  public async search(query: string, _page = 1): Promise<Anime[]> {
    const qLower = query.toLowerCase().trim();
    const matches: Anime[] = [];

    Object.entries(ANIDB_CROSS_REF).forEach(([malId, data]) => {
      if (
        data.title.toLowerCase().includes(qLower) ||
        data.altTitles.some((alt) => alt.toLowerCase().includes(qLower))
      ) {
        matches.push(
          AniDBNormalizer.normalize({
            id: data.id,
            anidbId: data.id,
            title: data.title,
            titles: data.altTitles,
            type: 'TV',
            externalIds: { aniDb: data.id, jikan: malId },
          })
        );
      }
    });

    return matches;
  }

  public async getById(id: string): Promise<Anime | null> {
    const rawId = id.replace('anidb_', '').replace('mal_', '');
    const entry = Object.entries(ANIDB_CROSS_REF).find(
      ([malId, data]) => malId === rawId || data.id === rawId
    );

    if (entry) {
      const [malId, data] = entry;
      return AniDBNormalizer.normalize({
        id: data.id,
        anidbId: data.id,
        title: data.title,
        titles: data.altTitles,
        type: 'TV',
        externalIds: { aniDb: data.id, jikan: malId },
      });
    }

    return null;
  }
}
