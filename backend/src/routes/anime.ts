import { Router, Request, Response, NextFunction } from 'express';
import { AnimeService } from '../services/AnimeService';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export const animeRouter = Router();

animeRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const page = parseInt((req.query.page as string) || '1', 10);

    const { results, cached } = await AnimeService.search(q, page);
    return sendSuccess(res, results, { cached, page, total: results.length });
  } catch (err) {
    next(err);
  }
});

animeRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { anime, cached } = await AnimeService.getById(id);

    if (!anime) {
      throw new NotFoundError(`Anime with ID "${id}" not found`);
    }

    return sendSuccess(res, anime, { cached });
  } catch (err) {
    next(err);
  }
});
