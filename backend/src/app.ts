// backend/src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import rootRoute from './routes/root.route';
import healthRoute from './routes/health.route';

// Load API docs
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

export function createApp(): Application {
  const app: Application = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Body parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Rate limiter with proper types
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS, // ms
    max: config.RATE_LIMIT_MAX, // max requests
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, _next: NextFunction, _options) => {
      res.status(429).json({ message: 'Too many requests' });
    },
  });
  app.use(limiter);

  // API Docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  app.use('/', rootRoute);
  app.use('/health', healthRoute);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
