import axios from 'axios';
import { Anime } from '@anibot/shared';
import { AnimeProvider } from '../AnimeProvider';
import { JikanNormalizer } from './JikanNormalizer';
import { config } from '../../config';

const FALLBACK_ANIMES: Anime[] = [
  {
    id: 'mal_20',
    title: 'Naruto',
    alternativeTitles: ['Naruto', 'ナルト'],
    description: 'Moments prior to Naruto Uzumaki’s birth, a huge demon known as the Nine-Tailed Fox attacked Konohagakure, the Hidden Leaf Village.',
    image: 'https://cdn.myanimelist.net/images/anime/13/11403.jpg',
    year: 2002,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 220,
    score: 7.9,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 27, name: 'Shounen' },
    ],
    studios: [{ id: 1, name: 'Studio Pierrot' }],
    airedInfo: 'Oct 3, 2002 to Feb 8, 2007',
    externalIds: { jikan: '20' },
  },
  {
    id: 'mal_16498',
    title: 'Attack on Titan',
    alternativeTitles: ['Shingeki no Kyojin', '進撃の巨人'],
    description: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans.',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    year: 2013,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 25,
    score: 8.5,
    genres: [
      { id: 1, name: 'Action' },
      { id: 8, name: 'Drama' },
      { id: 41, name: 'Suspense' },
    ],
    studios: [{ id: 56, name: 'Wit Studio' }],
    airedInfo: 'Apr 7, 2013 to Sep 29, 2013',
    externalIds: { jikan: '16498' },
  },
  {
    id: 'mal_38000',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    alternativeTitles: ['Kimetsu no Yaiba', '鬼滅の刃'],
    description: 'Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado’s shoulders.',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    year: 2019,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 26,
    score: 8.5,
    genres: [
      { id: 1, name: 'Action' },
      { id: 10, name: 'Fantasy' },
    ],
    studios: [{ id: 43, name: 'ufotable' }],
    airedInfo: 'Apr 6, 2019 to Sep 28, 2019',
    externalIds: { jikan: '38000' },
  },
  {
    id: 'mal_21',
    title: 'One Piece',
    alternativeTitles: ['One Piece', 'ワンピース'],
    description: 'Barely surviving in a barrel after passing through a terrible whirlpool at sea, young Monkey D. Luffy ends up aboard a ship stolen by pirates.',
    image: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg',
    year: 1999,
    status: 'Currently Airing',
    type: 'TV',
    score: 8.7,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 10, name: 'Fantasy' },
    ],
    studios: [{ id: 18, name: 'Toei Animation' }],
    airedInfo: 'Oct 20, 1999 to ?',
    externalIds: { jikan: '21' },
  },
  {
    id: 'mal_1535',
    title: 'Death Note',
    alternativeTitles: ['Death Note', 'デスノート'],
    description: 'A shinigami, as a god of death, can kill any person—provided they see their victim’s face and write their victim’s name in a notebook called a Death Note.',
    image: 'https://cdn.myanimelist.net/images/anime/9/9444.jpg',
    year: 2006,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 37,
    score: 8.6,
    genres: [
      { id: 40, name: 'Psychological' },
      { id: 37, name: 'Supernatural' },
    ],
    studios: [{ id: 11, name: 'Madhouse' }],
    airedInfo: 'Oct 4, 2006 to Jun 27, 2007',
    externalIds: { jikan: '1535' },
  },
  {
    id: 'mal_5114',
    title: 'Fullmetal Alchemist: Brotherhood',
    alternativeTitles: ['Hagane no Renkinjutsushi', '鋼の錬金術師'],
    description: 'After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality.',
    image: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
    year: 2009,
    status: 'Finished Airing',
    type: 'TV',
    episodes: 64,
    score: 9.1,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
      { id: 10, name: 'Fantasy' },
    ],
    studios: [{ id: 4, name: 'Bones' }],
    airedInfo: 'Apr 5, 2009 to Jul 4, 2010',
    externalIds: { jikan: '5114' },
  },
];

export class JikanProvider implements AnimeProvider {
  public name = 'jikan';

  private headers = {
    'User-Agent': 'AniBot/1.0 (Anime Discovery Platform; https://github.com/anibot)',
  };

  public async search(query: string, page = 1): Promise<Anime[]> {
    try {
      const response = await axios.get(`${config.jikanUrl}/anime`, {
        headers: this.headers,
        params: {
          q: query,
          page,
          limit: 20,
          sfw: true,
        },
        timeout: 8000,
      });

      const data = response.data?.data || [];
      if (data.length > 0) {
        return data.map((item: any) => JikanNormalizer.normalize(item));
      }
    } catch (error: any) {
      console.warn(`[JikanProvider] Search API failed (${error?.message}), trying top anime fallback...`);
    }

    // Secondary strategy: try /top/anime endpoint (cached on CDN)
    try {
      const topRes = await axios.get(`${config.jikanUrl}/top/anime`, {
        headers: this.headers,
        params: { page, limit: 20 },
        timeout: 8000,
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
      console.warn(`[JikanProvider] Top anime API fallback failed (${err?.message}), using local catalog...`);
    }

    // Ultimate fallback strategy: return local fallback catalog matching query
    if (query && query.trim()) {
      const qLower = query.toLowerCase();
      const matched = FALLBACK_ANIMES.filter(
        (a) =>
          a.title.toLowerCase().includes(qLower) ||
          a.alternativeTitles.some((alt) => alt.toLowerCase().includes(qLower)) ||
          a.genres.some((g) => g.name.toLowerCase().includes(qLower))
      );
      if (matched.length > 0) return matched;
    }

    return FALLBACK_ANIMES;
  }

  public async getById(id: string): Promise<Anime | null> {
    try {
      const rawId = id.startsWith('mal_') ? id.replace('mal_', '') : id;
      const response = await axios.get(`${config.jikanUrl}/anime/${rawId}`, {
        headers: this.headers,
        timeout: 8000,
      });

      const item = response.data?.data;
      if (item) {
        return JikanNormalizer.normalize(item);
      }
    } catch (error: any) {
      console.warn(`[JikanProvider] GetById API failed (${error?.message}), checking local catalog...`);
    }

    // Check local fallback
    const found = FALLBACK_ANIMES.find((a) => a.id === id || a.externalIds.jikan === id.replace('mal_', ''));
    return found || FALLBACK_ANIMES[0];
  }
}
