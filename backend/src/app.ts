import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { animeRouter } from './routes/anime';
import { quotesRouter } from './routes/quotes';
import { favouritesRouter } from './routes/favourites';
import { recentSearchesRouter } from './routes/recentSearches';
import { requestLogger } from './middleware/requestLogger';
import { searchRateLimiter, detailsRateLimiter, quotesRateLimiter } from './middleware/rateLimiter';
import { MetricsService } from './utils/metrics';
import { sendSuccess, sendError } from './utils/response';
import { AppError } from './utils/errors';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AniBot Backend API', timestamp: new Date().toISOString() });
});

// Phase 2 Observability Metrics endpoint
app.get('/api/v1/metrics', (_req: Request, res: Response) => {
  return sendSuccess(res, MetricsService.getMetrics());
});

// API Routes with Rate Limiters
app.use('/api/v1/anime/search', searchRateLimiter);
app.use('/api/v1/anime/:id', detailsRateLimiter);
app.use('/api/v1/quotes', quotesRateLimiter);

app.use('/api/v1/anime', animeRouter);
app.use('/api/v1/quotes', quotesRouter);
app.use('/api/v1/favourites', favouritesRouter);
app.use('/api/v1/recent-searches', recentSearchesRouter);

// 404 Handler
app.use((req: Request, res: Response) => {
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
  sendError(res, 'Endpoint not found', 404, 'NOT_FOUND', requestId);
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
  console.error(`[Global Error] [${requestId}]`, err);
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, requestId);
  }
  return sendError(res, 'An unexpected server error occurred', 500, 'INTERNAL_ERROR', requestId);
});
