import { Response } from 'express';
import { ApiSuccess, ApiErrorResponse } from '@anibot/shared';

export function sendSuccess<T>(res: Response, data: T, meta?: Record<string, unknown>, statusCode = 200) {
  const body: ApiSuccess<T> = {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  requestId = `req_${Date.now()}`
) {
  const body: ApiErrorResponse = {
    error: {
      code,
      message,
      requestId,
    },
  };
  return res.status(statusCode).json(body);
}
