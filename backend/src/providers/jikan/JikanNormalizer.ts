import { Anime, Genre, Studio } from '@anibot/shared';

export class JikanNormalizer {
  public static normalize(jikanItem: any): Anime {
    const genres: Genre[] = (jikanItem.genres || []).map((g: any) => ({
      id: g.mal_id,
      name: g.name,
    }));

    const studios: Studio[] = (jikanItem.studios || []).map((s: any) => ({
      id: s.mal_id,
      name: s.name,
    }));

    const alternativeTitles: string[] = [];
    if (jikanItem.title_english) alternativeTitles.push(jikanItem.title_english);
    if (jikanItem.title_japanese) alternativeTitles.push(jikanItem.title_japanese);
    if (Array.isArray(jikanItem.titles)) {
      jikanItem.titles.forEach((t: any) => {
        if (t.title && !alternativeTitles.includes(t.title) && t.title !== jikanItem.title) {
          alternativeTitles.push(t.title);
        }
      });
    }

    const year = jikanItem.year || (jikanItem.aired?.from ? new Date(jikanItem.aired.from).getFullYear() : undefined);

    return {
      id: `mal_${jikanItem.mal_id}`,
      title: jikanItem.title || 'Unknown Title',
      alternativeTitles,
      description: jikanItem.synopsis || undefined,
      image: jikanItem.images?.jpg?.large_image_url || jikanItem.images?.jpg?.image_url,
      bannerImage: jikanItem.images?.webp?.large_image_url,
      year,
      status: jikanItem.status,
      type: jikanItem.type,
      episodes: jikanItem.episodes,
      duration: jikanItem.duration ? parseInt(jikanItem.duration, 10) || undefined : undefined,
      score: jikanItem.score,
      genres,
      studios,
      airedInfo: jikanItem.aired?.string,
      externalIds: {
        jikan: String(jikanItem.mal_id),
      },
    };
  }
}
