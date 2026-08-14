import { prisma } from '../db';

export class CacheService {
  public static async get<T>(id: string): Promise<T | null> {
    try {
      const record = await prisma.animeCache.findUnique({
        where: { id },
      });

      if (!record) return null;
      if (new Date() > record.expiresAt) {
        // Expired
        await prisma.animeCache.delete({ where: { id } }).catch(() => {});
        return null;
      }

      return JSON.parse(record.data) as T;
    } catch {
      return null;
    }
  }

  public static async set<T>(id: string, data: T, provider: string, ttlMs: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttlMs);
      const jsonStr = JSON.stringify(data);

      await prisma.animeCache.upsert({
        where: { id },
        create: {
          id,
          data: jsonStr,
          provider,
          expiresAt,
        },
        update: {
          data: jsonStr,
          provider,
          cachedAt: new Date(),
          expiresAt,
        },
      });
    } catch (err) {
      console.warn(`[CacheService] Failed to set cache key=${id}:`, err);
    }
  }
}
