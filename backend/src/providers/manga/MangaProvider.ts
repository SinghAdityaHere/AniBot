import { Manga } from '@anibot/shared';

export interface MangaProvider {
  name: string;
  searchManga(query: string, page?: number): Promise<Manga[]>;
  getMangaById(id: string): Promise<Manga | null>;
}
