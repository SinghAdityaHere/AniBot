import { LibraryItem, LibraryCategory, RecentlyViewed, RecentSearch, Anime, Manga } from '@anibot/shared';

const STORAGE_KEYS = {
  FAVOURITES: 'anibot_favourites',
  LIBRARY: 'anibot_library',
  RECENTLY_VIEWED: 'anibot_recently_viewed',
  RECENT_SEARCHES: 'anibot_recent_searches',
};

// --- Library & Favourites Storage (Unified & Synced) ---
export function getStoredLibraryItems(): LibraryItem[] {
  try {
    const rawLibrary = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    const libraryItems: LibraryItem[] = rawLibrary ? JSON.parse(rawLibrary) : [];

    const rawFavs = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    const favItems: any[] = rawFavs ? JSON.parse(rawFavs) : [];

    const existingMediaIds = new Set(libraryItems.map((item) => item.mediaId || item.id));
    let hasNewMigrated = false;

    favItems.forEach((f: any) => {
      const mediaData = f.animeData || f.mediaData || (f.title ? f : null);
      const mediaId = f.animeId || f.mediaId || mediaData?.id || f.id;

      if (mediaId && !existingMediaIds.has(mediaId)) {
        const newItem: LibraryItem = {
          id: f.id || `lib_${mediaId}`,
          mediaId,
          mediaType: f.mediaType || 'anime',
          title: mediaData?.title || f.title || 'Saved Item',
          image: mediaData?.image || f.image,
          score: mediaData?.score || f.score,
          status: mediaData?.status || f.status,
          category: f.category || 'favourited',
          addedAt: f.createdAt || f.addedAt || new Date().toISOString(),
          mediaData: mediaData || ({ id: mediaId, title: f.title || 'Saved Item' } as any),
        };
        libraryItems.unshift(newItem);
        existingMediaIds.add(mediaId);
        hasNewMigrated = true;
      }
    });

    if (hasNewMigrated || !rawLibrary) {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libraryItems));
    }

    return libraryItems;
  } catch (err) {
    console.warn('[Storage] Error reading library items:', err);
    return [];
  }
}

export function saveStoredLibraryItem(
  mediaItem: Anime | Manga,
  mediaType: 'anime' | 'manga',
  category: LibraryCategory = 'favourited'
): LibraryItem {
  const list = getStoredLibraryItems();
  const existingIndex = list.findIndex((item) => item.mediaId === mediaItem.id);

  const newItem: LibraryItem = {
    id: existingIndex >= 0 ? list[existingIndex].id : `lib_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    mediaId: mediaItem.id,
    mediaType,
    title: mediaItem.title,
    image: mediaItem.image,
    score: mediaItem.score,
    status: mediaItem.status,
    category,
    addedAt: new Date().toISOString(),
    mediaData: mediaItem,
  };

  const updated = existingIndex >= 0
    ? list.map((item, idx) => (idx === existingIndex ? newItem : item))
    : [newItem, ...list];

  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updated));

  // Sync to anibot_favourites for backward compatibility
  try {
    const rawFavs = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    const favs = rawFavs ? JSON.parse(rawFavs) : [];
    if (!favs.some((f: any) => (f.animeId || f.animeData?.id) === mediaItem.id)) {
      favs.unshift({
        id: `fav_${Date.now()}`,
        userId: 'local_user',
        animeId: mediaItem.id,
        animeData: mediaItem,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(favs));
    }
  } catch {}

  return newItem;
}

export function removeStoredLibraryItem(mediaId: string): void {
  const cleanId = (idCandidate?: string | number) => {
    if (!idCandidate) return '';
    return String(idCandidate)
      .toLowerCase()
      .trim()
      .replace(/^lib_/, '')
      .replace(/^fav_/, '')
      .replace(/^mal_/, '')
      .replace(/^kitsu_manga_/, '')
      .replace(/^kitsu_/, '')
      .replace(/^mangadex_/, '')
      .replace(/^manga_/, '');
  };

  const targetClean = cleanId(mediaId);
  if (!targetClean) return;

  // 1. Clean anibot_library
  try {
    const rawLibrary = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    const libraryItems: LibraryItem[] = rawLibrary ? JSON.parse(rawLibrary) : [];
    const updatedLibrary = libraryItems.filter((item) => {
      const id1 = cleanId(item.mediaId);
      const id2 = cleanId(item.id);
      const id3 = cleanId(item.mediaData?.id);
      return id1 !== targetClean && id2 !== targetClean && id3 !== targetClean;
    });
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(updatedLibrary));
  } catch (err) {
    console.warn('[Storage] Error cleaning library item:', err);
  }

  // 2. Clean anibot_favourites
  try {
    const rawFavs = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (rawFavs) {
      const favs = JSON.parse(rawFavs);
      const updatedFavs = favs.filter((f: any) => {
        const id1 = cleanId(f.animeId);
        const id2 = cleanId(f.animeData?.id);
        const id3 = cleanId(f.id);
        return id1 !== targetClean && id2 !== targetClean && id3 !== targetClean;
      });
      localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updatedFavs));
    }
  } catch (err) {
    console.warn('[Storage] Error cleaning favourites item:', err);
  }
}

export function updateStoredLibraryCategory(mediaId: string, category: LibraryCategory): LibraryItem | null {
  const list = getStoredLibraryItems();
  const target = list.find((item) => item.mediaId === mediaId || item.id === mediaId);
  if (!target) return null;

  target.category = category;
  localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(list));
  return target;
}

// --- Recently Viewed Storage ---
export function getStoredRecentlyViewed(): RecentlyViewed[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[Storage] Error reading recently viewed:', err);
    return [];
  }
}

export function saveStoredRecentlyViewed(mediaId: string, mediaType: 'anime' | 'manga', title: string, image?: string): RecentlyViewed {
  const list = getStoredRecentlyViewed();
  const filtered = list.filter((item) => item.mediaId !== mediaId);

  const newItem: RecentlyViewed = {
    mediaId,
    mediaType,
    title,
    image,
    viewedAt: Date.now(),
  };

  const updated = [newItem, ...filtered].slice(0, 20);
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));
  return newItem;
}

export function removeStoredRecentlyViewed(mediaId: string): void {
  const list = getStoredRecentlyViewed();
  const updated = list.filter((item) => item.mediaId !== mediaId);
  localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(updated));
}

export function clearStoredRecentlyViewed(): void {
  localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
}
