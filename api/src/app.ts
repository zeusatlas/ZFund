import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import path from 'path';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { correlationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { globalRateLimiter } from './common/middleware/rate-limiter.middleware';
import { env } from './config/env';
import { logger } from './config/logger';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes/index.route';

export function createApp(): Application {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'x-correlation-id',
        'x-paystack-signature',
        'x-nalo-token',
      ],
    })
  );

  // Cookie parser
  app.use(cookieParser());

  // Request correlation tracking
  app.use(correlationIdMiddleware);

  // Structured HTTP logging (skip health checks for clean logs)
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        autoLogging: {
          ignore: (req) => req.url?.includes('/health') || req.url?.includes('/ready'),
        },
      })
    );
  }

  // JSON Body Parser with raw body preservation for webhook HMAC verification
  app.use(
    express.json({
      limit: '10mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Global Rate Limiting
  app.use(globalRateLimiter);

  // Swagger UI Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  app.get(['/api-docs.html', '/docs'], (_req, res) => {
    res.sendFile(path.resolve(__dirname, '../API-DOCS.HTML'));
  });

  // Base API routes
  app.use(env.API_PREFIX, apiRoutes);

  // Fallback 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Resource not found on path ${req.originalUrl}`,
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
