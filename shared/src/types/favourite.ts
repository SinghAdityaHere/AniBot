import { Anime } from './anime';

export interface Favourite {
  id: string;
  userId: string;
  animeId: string;
  animeData: Anime;
  createdAt: string;
}
