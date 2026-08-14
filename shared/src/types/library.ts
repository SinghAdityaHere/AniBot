import { Anime } from './anime';
import { Manga } from './manga';

export type LibraryCategory =
  | 'favourited'
  | 'plan_to_watch'
  | 'watching'
  | 'completed'
  | 'plan_to_read'
  | 'reading';

export interface LibraryItem {
  id: string;
  mediaId: string;
  mediaType: 'anime' | 'manga';
  title: string;
  image?: string;
  score?: number;
  status?: string;
  category: LibraryCategory;
  addedAt: string;
  mediaData: Anime | Manga;
}
