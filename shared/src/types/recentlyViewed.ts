export interface RecentlyViewed {
  mediaId: string;
  mediaType: 'anime' | 'manga';
  title: string;
  image?: string;
  viewedAt: number;
}
