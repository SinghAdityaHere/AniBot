import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../utils/metrics';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startMs = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startMs;
    console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);

    MetricsService.track('anibot.request.latency_ms', duration, {
      path: req.path,
      method: req.method,
      status: String(res.statusCode),
    });
  });

  next();
}
