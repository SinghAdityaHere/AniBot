import { Genre, MediaRelation } from './anime';

export interface Author {
  id: string | number;
  name: string;
}

export interface MangaExternalIds {
  jikan?: string;
  mangaDex?: string;
  kitsu?: string;
}

export interface Manga {
  id: string;
  title: string;
  alternativeTitles: string[];
  description?: string;
  image?: string;
  bannerImage?: string;
  year?: number;
  status?: string;
  type?: string; // Manga, Manhwa, Manhua, Light Novel, Doujinshi
  chapters?: number;
  volumes?: number;
  score?: number;
  genres: Genre[];
  authors: Author[];
  publishedInfo?: string;
  externalIds: MangaExternalIds;
  relations?: MediaRelation[];
}

export interface AnimeFact {
  id: string | number;
  fact: string;
  animeTitle?: string;
}
