import { Router, Request, Response, NextFunction } from 'express';
import { FactsService } from '../services/FactsService';
import { sendSuccess } from '../utils/response';

export const factsRouter = Router();

factsRouter.get('/random', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { fact, cached } = await FactsService.getRandomFact();
    return sendSuccess(res, fact, { cached });
  } catch (err) {
    next(err);
  }
});
