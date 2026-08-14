import { Anime } from '@anibot/shared';

export interface AnimeProvider {
  name: string;
  search(query: string, page?: number): Promise<Anime[]>;
  getById(id: string): Promise<Anime | null>;
}
