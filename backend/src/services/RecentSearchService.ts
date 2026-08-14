import { RecentSearch } from '@anibot/shared';
import { prisma } from '../db';
import { ValidationError } from '../utils/errors';

export class RecentSearchService {
  private static MAX_LIMIT = 20;

  public static async list(userId: string): Promise<RecentSearch[]> {
    const records = await prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: this.MAX_LIMIT,
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      query: r.query,
      animeId: r.animeId || undefined,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public static async add(userId: string, query: string, animeId?: string): Promise<RecentSearch> {
    const trimmed = query.trim();
    if (!userId || !trimmed) {
      throw new ValidationError('userId and non-empty query are required');
    }

    // Delete existing duplicate query for clean consolidation
    await prisma.recentSearch.deleteMany({
      where: {
        userId,
        query: {
          equals: trimmed,
        },
      },
    });

    const record = await prisma.recentSearch.create({
      data: {
        userId,
        query: trimmed,
        animeId,
      },
    });

    // Cleanup entries over limit
    const all = await prisma.recentSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (all.length > this.MAX_LIMIT) {
      const toDelete = all.slice(this.MAX_LIMIT).map((item) => item.id);
      await prisma.recentSearch.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    return {
      id: record.id,
      userId: record.userId,
      query: record.query,
      animeId: record.animeId || undefined,
      createdAt: record.createdAt.toISOString(),
    };
  }

  public static async delete(userId: string, id: string): Promise<void> {
    await prisma.recentSearch.deleteMany({
      where: { id, userId },
    });
  }

  public static async clearAll(userId: string): Promise<void> {
    await prisma.recentSearch.deleteMany({
      where: { userId },
    });
  }
}
