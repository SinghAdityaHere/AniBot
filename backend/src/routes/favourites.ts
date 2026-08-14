import { Router, Request, Response, NextFunction } from 'express';
import { FavouriteService } from '../services/FavouriteService';
import { sendSuccess } from '../utils/response';
import { ValidationError } from '../utils/errors';

export const favouritesRouter = Router();

// Helper to get userId from header or fallback
function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  return userId || 'default_user';
}

favouritesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const favourites = await FavouriteService.list(userId);
    return sendSuccess(res, favourites);
  } catch (err) {
    next(err);
  }
});

favouritesRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { animeId, animeData } = req.body;

    if (!animeId || !animeData) {
      throw new ValidationError('animeId and animeData are required in body');
    }

    const favourite = await FavouriteService.add(userId, animeId, animeData);
    return sendSuccess(res, favourite, undefined, 201);
  } catch (err) {
    next(err);
  }
});

favouritesRouter.delete('/:animeId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { animeId } = req.params;

    await FavouriteService.remove(userId, animeId);
    return sendSuccess(res, { removed: true });
  } catch (err) {
    next(err);
  }
});
