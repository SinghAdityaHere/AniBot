export interface Genre {
  id: string | number;
  name: string;
}

export interface Studio {
  id: string | number;
  name: string;
}

export interface ExternalIds {
  jikan?: string;
  aniDb?: string;
}

export interface Anime {
  id: string;
  title: string;
  alternativeTitles: string[];
  description?: string;
  image?: string;
  bannerImage?: string;
  year?: number;
  status?: string;
  type?: string;
  episodes?: number;
  duration?: number;
  score?: number;
  genres: Genre[];
  studios: Studio[];
  airedInfo?: string;
  externalIds: ExternalIds;
}
