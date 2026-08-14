import { Router, Request, Response, NextFunction } from 'express';
import { QuoteService } from '../services/QuoteService';
import { sendSuccess } from '../utils/response';

export const quotesRouter = Router();

quotesRouter.get('/random', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quote, cached } = await QuoteService.getRandomQuote();
    return sendSuccess(res, quote, { cached });
  } catch (err) {
    next(err);
  }
});

quotesRouter.get('/anime', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = (req.query.title as string) || '';
    const { quotes, cached } = await QuoteService.getQuotesByAnime(title);
    return sendSuccess(res, quotes, { cached });
  } catch (err) {
    next(err);
  }
});
