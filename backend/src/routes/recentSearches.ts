import { Router, Request, Response, NextFunction } from 'express';
import { RecentSearchService } from '../services/RecentSearchService';
import { sendSuccess } from '../utils/response';
import { ValidationError } from '../utils/errors';

export const recentSearchesRouter = Router();

function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  return userId || 'default_user';
}

recentSearchesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const searches = await RecentSearchService.list(userId);
    return sendSuccess(res, searches);
  } catch (err) {
    next(err);
  }
});

recentSearchesRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { query, animeId } = req.body;

    if (!query) {
      throw new ValidationError('query is required');
    }

    const item = await RecentSearchService.add(userId, query, animeId);
    return sendSuccess(res, item, undefined, 201);
  } catch (err) {
    next(err);
  }
});

recentSearchesRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    await RecentSearchService.delete(userId, id);
    return sendSuccess(res, { deleted: true });
  } catch (err) {
    next(err);
  }
});

recentSearchesRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    await RecentSearchService.clearAll(userId);
    return sendSuccess(res, { cleared: true });
  } catch (err) {
    next(err);
  }
});
