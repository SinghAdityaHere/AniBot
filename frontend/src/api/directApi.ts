import { Anime, Manga, AnimeQuote, AnimeFact, Favourite, RecentSearch } from '@anibot/shared';

// Helper to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Check if running on static host like GitHub Pages
export function isStaticHost(): boolean {
  return typeof window !== 'undefined' && (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  );
}

// Direct Browser Anime Fetching (Jikan v4 -> Kitsu fallback)
export async function fetchDirectAnimeSearch(query: string, page = 1): Promise<Anime[]> {
  try {
    const url = query && query.trim()
      ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query.trim())}&page=${page}&limit=20&sfw=true`
      : `https://api.jikan.moe/v4/top/anime?page=${page}&limit=20`;

    const res = await fetchWithTimeout(url);
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      if (items.length > 0) {
        return items.map((item: any) => normalizeJikan(item));
      }
    }
  } catch (err) {
    console.warn('[DirectApi] Jikan API failed, trying live Kitsu API fallback...', err);
  }

  // Fallback to Kitsu API directly from browser
  try {
    const offset = (page - 1) * 20;
    const kitsuUrl = query && query.trim()
      ? `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query.trim())}&page[limit]=20&page[offset]=${offset}`
      : `https://kitsu.io/api/edge/anime?sort=-userCount&page[limit]=20&page[offset]=${offset}`;

    const res = await fetchWithTimeout(kitsuUrl);
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      return items.map((item: any) => normalizeKitsu(item));
    }
  } catch (err) {
    console.warn('[DirectApi] Kitsu API fallback failed:', err);
  }

  return [];
}

export async function fetchDirectAnimeDetail(id: string): Promise<Anime | null> {
  const rawId = id.replace('mal_', '').replace('kitsu_', '');

  if (id.startsWith('kitsu_')) {
    try {
      const res = await fetchWithTimeout(`https://kitsu.io/api/edge/anime/${rawId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return normalizeKitsu(json.data);
      }
    } catch {}
  }

  try {
    const res = await fetchWithTimeout(`https://api.jikan.moe/v4/anime/${rawId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeJikan(json.data);
    }
  } catch {}

  // Fallback to Kitsu
  try {
    const res = await fetchWithTimeout(`https://kitsu.io/api/edge/anime/${rawId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeKitsu(json.data);
    }
  } catch {}

  return null;
}

// Direct Browser Manga Fetching (Jikan Manga -> Kitsu Manga -> MangaDex)
export async function fetchDirectMangaSearch(query: string, page = 1): Promise<Manga[]> {
  const q = (query || '').trim();

  // Try Jikan (MyAnimeList) Manga API
  try {
    const jikanMangaUrl = q
      ? `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&page=${page}&limit=20`
      : `https://api.jikan.moe/v4/top/manga?page=${page}&limit=20`;

    const res = await fetchWithTimeout(jikanMangaUrl);
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      if (items.length > 0) {
        return items.map((item: any) => normalizeJikanManga(item));
      }
    }
  } catch (err) {
    console.warn('[DirectApi] Jikan Manga failed, trying Kitsu Manga...', err);
  }

  // Try Kitsu Manga API
  try {
    const offset = (page - 1) * 20;
    const kitsuMangaUrl = q
      ? `https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(q)}&page[limit]=20&page[offset]=${offset}`
      : `https://kitsu.io/api/edge/manga?sort=-userCount&page[limit]=20&page[offset]=${offset}`;

    const res = await fetchWithTimeout(kitsuMangaUrl);
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      if (items.length > 0) {
        return items.map((item: any) => normalizeKitsuManga(item));
      }
    }
  } catch (err) {
    console.warn('[DirectApi] Kitsu Manga failed, trying MangaDex...', err);
  }

  // Try MangaDex API
  try {
    const offset = (page - 1) * 20;
    const mangaDexUrl = q
      ? `https://api.mangadex.org/manga?title=${encodeURIComponent(q)}&limit=20&offset=${offset}&includes%5B%5D=cover_art`
      : `https://api.mangadex.org/manga?limit=20&offset=${offset}&order%5BfollowedCount%5D=desc&includes%5B%5D=cover_art`;

    const res = await fetchWithTimeout(mangaDexUrl);
    if (res.ok) {
      const json = await res.json();
      const items = json.data || [];
      return items.map((item: any) => normalizeMangaDex(item));
    }
  } catch (err) {
    console.warn('[DirectApi] MangaDex API failed:', err);
  }

  return [];
}

export async function fetchDirectMangaDetail(id: string): Promise<Manga | null> {
  const rawId = id.replace('mangadex_', '').replace('kitsu_manga_', '').replace('manga_', '').replace('mal_', '');

  // 1. Kitsu Manga ID
  if (id.startsWith('kitsu_manga_') || id.startsWith('kitsu_')) {
    try {
      const res = await fetchWithTimeout(`https://kitsu.io/api/edge/manga/${rawId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return normalizeKitsuManga(json.data);
      }
    } catch (e) {
      console.warn('[DirectApi] Kitsu manga detail fetch error:', e);
    }
  }

  // 2. MangaDex ID
  if (id.startsWith('mangadex_')) {
    try {
      const res = await fetchWithTimeout(`https://api.mangadex.org/manga/${rawId}?includes%5B%5D=cover_art`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return normalizeMangaDex(json.data);
      }
    } catch (e) {
      console.warn('[DirectApi] MangaDex detail fetch error:', e);
    }
  }

  // 3. MyAnimeList / Jikan Manga ID
  try {
    const res = await fetchWithTimeout(`https://api.jikan.moe/v4/manga/${rawId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeJikanManga(json.data);
    }
  } catch (e) {
    console.warn('[DirectApi] Jikan manga detail fetch error:', e);
  }

  // Fallbacks across providers
  try {
    const res = await fetchWithTimeout(`https://kitsu.io/api/edge/manga/${rawId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeKitsuManga(json.data);
    }
  } catch {}

  try {
    const res = await fetchWithTimeout(`https://api.mangadex.org/manga/${rawId}?includes%5B%5D=cover_art`);
    if (res.ok) {
      const json = await res.json();
      if (json.data) return normalizeMangaDex(json.data);
    }
  } catch {}

  return null;
}

// Direct Browser Quote & Fact Fetching
export async function fetchDirectRandomQuote(): Promise<AnimeQuote> {
  try {
    const res = await fetchWithTimeout('https://animechan.xyz/api/random', {}, 5000);
    if (res.ok) {
      const data = await res.json();
      if (data && data.quote) {
        return {
          id: `ac_${Date.now()}`,
          quote: data.quote,
          character: data.character,
          animeTitle: data.anime,
        };
      }
    }
  } catch {}

  try {
    const res = await fetchWithTimeout('https://api.quotable.io/quotes/random?tags=wisdom|inspirational', {}, 5000);
    if (res.ok) {
      const data = await res.json();
      const item = Array.isArray(data) ? data[0] : data;
      if (item && item.content) {
        return {
          id: `q_${Date.now()}`,
          quote: item.content,
          character: item.author,
          animeTitle: 'Inspirational Quote',
        };
      }
    }
  } catch {}

  return {
    id: 'quote_fallback',
    quote: "If you don't take risks, you can't create a future.",
    character: 'Monkey D. Luffy',
    animeTitle: 'One Piece',
  };
}

export async function fetchDirectAnimeQuotes(title?: string): Promise<AnimeQuote[]> {
  if (!title) return [];
  try {
    const res = await fetchWithTimeout(`https://animechan.xyz/api/quotes/anime?title=${encodeURIComponent(title)}`, {}, 5000);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 5).map((item: any, idx: number) => ({
          id: `ac_q_${idx}_${Date.now()}`,
          quote: item.quote,
          character: item.character,
          animeTitle: item.anime || title,
        }));
      }
    }
  } catch {}
  return [];
}

export async function fetchDirectRandomFact(): Promise<AnimeFact> {
  const animes = ['fma', 'naruto', 'bleach', 'one_piece', 'attack_on_titan', 'dragon_ball'];
  const anime = animes[Math.floor(Math.random() * animes.length)];
  try {
    const res = await fetchWithTimeout(`https://anime-facts-rest-api.herokuapp.com/api/v1/${anime}`, {}, 5000);
    if (res.ok) {
      const json = await res.json();
      const facts = json.data || [];
      if (Array.isArray(facts) && facts.length > 0) {
        const item = facts[Math.floor(Math.random() * facts.length)];
        return {
          id: item.id || `fact_${Date.now()}`,
          fact: item.fact,
          animeTitle: anime.replace(/_/g, ' ').toUpperCase(),
        };
      }
    }
  } catch {}

  return {
    id: 'fact_fallback',
    fact: 'Akira Toriyama, creator of Dragon Ball, drew inspiration from the 16th-century Chinese novel Journey to the West.',
    animeTitle: 'Dragon Ball',
  };
}

// LocalStorage Favourites & Recent Searches
export function getLocalFavourites(): Favourite[] {
  try {
    const raw = localStorage.getItem('anibot_favourites');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalFavourite(animeId: string, animeData: Anime): Favourite {
  const list = getLocalFavourites();
  const existing = list.find((f) => f.animeId === animeId);
  if (existing) return existing;

  const newItem: Favourite = {
    id: `fav_${Date.now()}`,
    userId: 'local_user',
    animeId,
    animeData,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...list];
  localStorage.setItem('anibot_favourites', JSON.stringify(updated));
  return newItem;
}

export function removeLocalFavourite(animeId: string): void {
  const list = getLocalFavourites();
  const updated = list.filter((f) => f.animeId !== animeId);
  localStorage.setItem('anibot_favourites', JSON.stringify(updated));
}

export function getLocalRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem('anibot_recent_searches');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalRecentSearch(query: string, animeId?: string): RecentSearch {
  const trimmed = query.trim();
  const list = getLocalRecentSearches().filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase());
  const newItem: RecentSearch = {
    id: `search_${Date.now()}`,
    userId: 'local_user',
    query: trimmed,
    animeId,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...list].slice(0, 20);
  localStorage.setItem('anibot_recent_searches', JSON.stringify(updated));
  return newItem;
}

export function deleteLocalRecentSearch(id: string): void {
  const list = getLocalRecentSearches();
  const updated = list.filter((s) => s.id !== id);
  localStorage.setItem('anibot_recent_searches', JSON.stringify(updated));
}

export function clearLocalRecentSearches(): void {
  localStorage.removeItem('anibot_recent_searches');
}

// Normalizers
function normalizeJikan(item: any): Anime {
  return {
    id: `mal_${item.mal_id}`,
    title: item.title || 'Unknown Title',
    alternativeTitles: item.title_english ? [item.title_english] : [],
    description: item.synopsis || undefined,
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
    bannerImage: item.images?.webp?.large_image_url,
    year: item.year || (item.aired?.from ? new Date(item.aired.from).getFullYear() : undefined),
    status: item.status,
    type: item.type,
    episodes: item.episodes,
    score: item.score,
    genres: (item.genres || []).map((g: any) => ({ id: g.mal_id, name: g.name })),
    studios: (item.studios || []).map((s: any) => ({ id: s.mal_id, name: s.name })),
    airedInfo: item.aired?.string,
    externalIds: { jikan: String(item.mal_id) },
  };
}

function normalizeKitsu(item: any): Anime {
  const attr = item.attributes || {};
  return {
    id: `kitsu_${item.id}`,
    title: attr.canonicalTitle || attr.en_jp || 'Unknown Anime',
    alternativeTitles: attr.titles ? Object.values(attr.titles).filter((t): t is string => typeof t === 'string') : [],
    description: attr.synopsis || undefined,
    image: attr.posterImage?.large || attr.posterImage?.medium,
    year: attr.startDate ? new Date(attr.startDate).getFullYear() : undefined,
    status: attr.status === 'finished' ? 'Finished Airing' : 'Airing',
    type: attr.showType ? attr.showType.toUpperCase() : 'TV',
    episodes: attr.episodeCount || undefined,
    score: attr.averageRating ? parseFloat(attr.averageRating) / 10 : undefined,
    genres: [],
    studios: [],
    airedInfo: attr.startDate ? `${attr.startDate} to ${attr.endDate || 'Present'}` : undefined,
    externalIds: { jikan: item.id },
  };
}

function normalizeKitsuManga(item: any): Manga {
  const attr = item.attributes || {};
  return {
    id: `kitsu_manga_${item.id}`,
    title: attr.canonicalTitle || attr.en_jp || attr.en || 'Unknown Manga',
    alternativeTitles: attr.titles ? Object.values(attr.titles).filter((t): t is string => typeof t === 'string') : [],
    description: attr.synopsis || attr.description || undefined,
    image: attr.posterImage?.large || attr.posterImage?.medium || attr.posterImage?.original,
    year: attr.startDate ? new Date(attr.startDate).getFullYear() : undefined,
    status: attr.status === 'finished' ? 'Finished' : 'Publishing',
    type: attr.mangaType ? attr.mangaType.toUpperCase() : 'MANGA',
    chapters: attr.chapterCount || undefined,
    volumes: attr.volumeCount || undefined,
    score: attr.averageRating ? parseFloat(attr.averageRating) / 10 : undefined,
    genres: [],
    authors: [],
    externalIds: { kitsu: String(item.id) },
  };
}

function normalizeMangaDex(item: any): Manga {
  const attr = item.attributes || {};
  const title = attr.title?.en || attr.title?.ja || Object.values(attr.title || {})[0] || 'Unknown Manga';
  const coverRel = (item.relationships || []).find((r: any) => r.type === 'cover_art');
  const coverFileName = coverRel?.attributes?.fileName;
  const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${item.id}/${coverFileName}.256.jpg` : undefined;

  return {
    id: `mangadex_${item.id}`,
    title,
    alternativeTitles: [],
    description: attr.description?.en || Object.values(attr.description || {})[0] || undefined,
    image: coverUrl,
    year: attr.year || undefined,
    status: attr.status === 'completed' ? 'Finished' : 'Publishing',
    type: attr.originalLanguage === 'ja' ? 'MANGA' : 'MANHWA',
    genres: (attr.tags || []).map((t: any) => ({ id: t.id, name: t.attributes?.name?.en || 'Genre' })),
    authors: [],
    externalIds: { mangaDex: item.id },
  };
}

function normalizeJikanManga(item: any): Manga {
  return {
    id: `manga_${item.mal_id}`,
    title: item.title || item.title_english || 'Unknown Manga',
    alternativeTitles: item.title_english ? [item.title_english] : [],
    description: item.synopsis || item.background || undefined,
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
    year: item.published?.from ? new Date(item.published.from).getFullYear() : undefined,
    status: item.status,
    type: item.type || 'MANGA',
    chapters: item.chapters || undefined,
    volumes: item.volumes || undefined,
    score: item.score || undefined,
    genres: (item.genres || []).map((g: any) => ({ id: g.mal_id, name: g.name })),
    authors: (item.authors || []).map((a: any) => ({ id: a.mal_id, name: a.name })),
    externalIds: { jikan: String(item.mal_id) },
  };
}
