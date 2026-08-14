import { Anime, Genre, Studio } from '@anibot/shared';

export class AniDBNormalizer {
  public static normalize(anidbItem: any): Anime {
    const genres: Genre[] = (anidbItem.categories || []).map((c: any, index: number) => ({
      id: c.id || index,
      name: c.name || c,
    }));

    const studios: Studio[] = (anidbItem.creators?.group || []).map((s: any, index: number) => ({
      id: s.id || index,
      name: s.name || s,
    }));

    const alternativeTitles: string[] = [];
    if (anidbItem.titles) {
      anidbItem.titles.forEach((t: any) => {
        if (typeof t === 'string' && t !== anidbItem.title) {
          alternativeTitles.push(t);
        } else if (t.title && t.title !== anidbItem.title) {
          alternativeTitles.push(t.title);
        }
      });
    }

    return {
      id: `anidb_${anidbItem.id || anidbItem.anidbId}`,
      title: anidbItem.title || 'Unknown AniDB Title',
      alternativeTitles,
      description: anidbItem.description || anidbItem.summary || undefined,
      image: anidbItem.picture ? `https://cdn-us.anidb.net/images/main/${anidbItem.picture}` : undefined,
      year: anidbItem.startDate ? new Date(anidbItem.startDate).getFullYear() : undefined,
      status: anidbItem.endDate ? (new Date(anidbItem.endDate) < new Date() ? 'Finished Airing' : 'Currently Airing') : 'Airing',
      type: anidbItem.type || 'TV',
      episodes: anidbItem.episodeCount || undefined,
      score: anidbItem.rating ? parseFloat(anidbItem.rating) / 10 : undefined,
      genres,
      studios,
      airedInfo: anidbItem.startDate ? `${anidbItem.startDate} to ${anidbItem.endDate || 'Present'}` : undefined,
      externalIds: {
        aniDb: String(anidbItem.id || anidbItem.anidbId),
      },
    };
  }

  public static enrich(primary: Anime, enrichment: Partial<Anime>): Anime {
    return {
      ...primary,
      alternativeTitles: Array.from(new Set([...primary.alternativeTitles, ...(enrichment.alternativeTitles || [])])),
      description: primary.description || enrichment.description,
      genres: primary.genres.length > 0 ? primary.genres : enrichment.genres || [],
      studios: primary.studios.length > 0 ? primary.studios : enrichment.studios || [],
      externalIds: {
        ...primary.externalIds,
        ...enrichment.externalIds,
      },
    };
  }
}
