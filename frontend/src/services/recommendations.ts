import { Anime, Manga } from '@anibot/shared';

export interface ScoredMedia<T extends Anime | Manga> {
  item: T;
  score: number;
}

export function rankRecommendations<T extends Anime | Manga>(
  seed: T,
  candidates: T[]
): T[] {
  const seedGenres = new Set((seed.genres || []).map((g) => g.name.toLowerCase()));
  const seedTitleWords = seed.title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const scored: ScoredMedia<T>[] = candidates
    .filter((candidate) => candidate.id !== seed.id)
    .map((candidate) => {
      let score = 0;

      // 1. Same Genre match (+30 per matching genre)
      if (candidate.genres) {
        candidate.genres.forEach((g) => {
          if (seedGenres.has(g.name.toLowerCase())) {
            score += 30;
          }
        });
      }

      // 2. Title similarity (+40 if title word matches)
      const candTitleLower = candidate.title.toLowerCase();
      seedTitleWords.forEach((word) => {
        if (candTitleLower.includes(word)) {
          score += 40;
        }
      });

      // 3. Similar format / type (+10)
      if (seed.type && candidate.type && seed.type === candidate.type) {
        score += 10;
      }

      // 4. High score bonus (+10 if score > 8.0)
      if (candidate.score && candidate.score >= 8.0) {
        score += 10;
      }

      // 5. Score proximity (+10 if score within 0.5 of seed)
      if (seed.score && candidate.score && Math.abs(seed.score - candidate.score) <= 0.5) {
        score += 10;
      }

      return { item: candidate, score };
    });

  // Sort descending by calculated score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
