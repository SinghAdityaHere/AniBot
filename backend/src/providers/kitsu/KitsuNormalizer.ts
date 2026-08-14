import { Anime, Genre, Studio } from '@anibot/shared';

export class KitsuNormalizer {
  public static normalize(kitsuItem: any): Anime {
    const attr = kitsuItem.attributes || {};

    const alternativeTitles: string[] = [];
    if (attr.titles) {
      Object.values(attr.titles).forEach((t: any) => {
        if (typeof t === 'string' && t !== attr.canonicalTitle && !alternativeTitles.includes(t)) {
          alternativeTitles.push(t);
        }
      });
    }

    const year = attr.startDate ? new Date(attr.startDate).getFullYear() : undefined;

    return {
      id: `kitsu_${kitsuItem.id}`,
      title: attr.canonicalTitle || attr.en || attr.en_jp || 'Unknown Anime',
      alternativeTitles,
      description: attr.synopsis || attr.description || undefined,
      image: attr.posterImage?.large || attr.posterImage?.original || attr.posterImage?.medium,
      bannerImage: attr.coverImage?.large || attr.coverImage?.original,
      year,
      status: attr.status === 'finished' ? 'Finished Airing' : attr.status === 'current' ? 'Currently Airing' : attr.status,
      type: attr.showType ? attr.showType.toUpperCase() : 'TV',
      episodes: attr.episodeCount || undefined,
      duration: attr.episodeLength || undefined,
      score: attr.averageRating ? parseFloat(attr.averageRating) / 10 : undefined,
      genres: [],
      studios: [],
      airedInfo: attr.startDate ? `${attr.startDate} to ${attr.endDate || 'Present'}` : undefined,
      externalIds: {
        jikan: kitsuItem.id,
      },
    };
  }
}
