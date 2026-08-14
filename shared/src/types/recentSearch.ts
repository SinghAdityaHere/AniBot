export interface RecentSearch {
  id: string;
  userId: string;
  query: string;
  animeId?: string;
  mediaType?: 'anime' | 'manga' | 'all';
  createdAt: string;
}
