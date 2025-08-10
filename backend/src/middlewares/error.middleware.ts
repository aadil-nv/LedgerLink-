// backend/src/middleware/error.middleware.ts
import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err: ApiError, req: Request, res: Response, _next: NextFunction): void {
  const status = err.status ?? 500;
  const payload = {
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack, details: err.details } : {}),
  };
  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');
  res.status(status).json(payload);
}
