import { Router, Request, Response, NextFunction } from 'express';
import { MangaService } from '../services/MangaService';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export const mangaRouter = Router();

mangaRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    const page = parseInt((req.query.page as string) || '1', 10);

    const { results, cached } = await MangaService.searchManga(q, page);
    return sendSuccess(res, results, { cached, page, total: results.length });
  } catch (err) {
    next(err);
  }
});

mangaRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { manga, cached } = await MangaService.getMangaById(id);

    if (!manga) {
      throw new NotFoundError(`Manga with ID "${id}" not found`);
    }

    return sendSuccess(res, manga, { cached });
  } catch (err) {
    next(err);
  }
});
