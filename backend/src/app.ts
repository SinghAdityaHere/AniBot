import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { animeRouter } from './routes/anime';
import { quotesRouter } from './routes/quotes';
import { favouritesRouter } from './routes/favourites';
import { recentSearchesRouter } from './routes/recentSearches';
import { sendError } from './utils/response';
import { AppError } from './utils/errors';

export const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AniBot Backend API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/anime', animeRouter);
app.use('/api/v1/quotes', quotesRouter);
app.use('/api/v1/favourites', favouritesRouter);
app.use('/api/v1/recent-searches', recentSearchesRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  sendError(res, 'Endpoint not found', 404, 'NOT_FOUND');
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error]', err);
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code);
  }
  return sendError(res, 'An unexpected server error occurred', 500, 'INTERNAL_ERROR');
});
