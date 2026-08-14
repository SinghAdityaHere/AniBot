import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

export function createRateLimiter(maxRequests: number, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userId = (req.headers['x-user-id'] as string) || ip;
    const key = `${req.baseUrl}${req.path}:${userId}`;

    const now = Date.now();
    const current = rateLimitMap.get(key);

    if (!current || now > current.resetTime) {
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (current.count >= maxRequests) {
      const requestId = (req.headers['x-request-id'] as string) || `req_${Date.now()}`;
      res.setHeader('Retry-After', Math.ceil((current.resetTime - now) / 1000));
      sendError(
        res,
        'Too many requests. Please wait a moment before trying again.',
        429,
        'RATE_LIMITED',
        requestId
      );
      return;
    }

    current.count += 1;
    next();
  };
}

export const searchRateLimiter = createRateLimiter(30, 60 * 1000); // 30 req/min
export const detailsRateLimiter = createRateLimiter(60, 60 * 1000); // 60 req/min
export const quotesRateLimiter = createRateLimiter(10, 60 * 1000);  // 10 req/min
