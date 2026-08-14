import { Favourite, Anime } from '@anibot/shared';
import { prisma } from '../db';
import { ValidationError, NotFoundError } from '../utils/errors';

export class FavouriteService {
  public static async list(userId: string): Promise<Favourite[]> {
    const records = await prisma.favourite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      userId: r.userId,
      animeId: r.animeId,
      animeData: JSON.parse(r.animeData) as Anime,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public static async add(userId: string, animeId: string, animeData: Anime): Promise<Favourite> {
    if (!userId || !animeId || !animeData) {
      throw new ValidationError('userId, animeId, and animeData are required');
    }

    const jsonStr = JSON.stringify(animeData);

    const record = await prisma.favourite.upsert({
      where: {
        userId_animeId: { userId, animeId },
      },
      create: {
        userId,
        animeId,
        animeData: jsonStr,
      },
      update: {
        animeData: jsonStr,
      },
    });

    return {
      id: record.id,
      userId: record.userId,
      animeId: record.animeId,
      animeData,
      createdAt: record.createdAt.toISOString(),
    };
  }

  public static async remove(userId: string, animeId: string): Promise<void> {
    try {
      await prisma.favourite.delete({
        where: {
          userId_animeId: { userId, animeId },
        },
      });
    } catch {
      throw new NotFoundError('Favourite not found');
    }
  }
}
