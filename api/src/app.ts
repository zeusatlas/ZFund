import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
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
import ussdRuntimeRoutes from './routes/ussd-runtime.routes';

export function createApp(): Application {
  const app = express();

  // Deduplicate CORS headers to prevent duplicate values (e.g. from multiple middlewares)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    const originalWriteHead = res.writeHead.bind(res);
    res.writeHead = function (...args: any[]) {
      const existing = res.getHeader('Access-Control-Allow-Origin');
      if (existing !== undefined) {
        let raw: string;
        if (Array.isArray(existing)) {
          raw = existing[0] ?? '';
        } else {
          raw = String(existing);
        }
        const cleaned = raw.split(',')[0]?.trim() ?? raw;
        if (cleaned) {
          res.setHeader('Access-Control-Allow-Origin', cleaned);
        }
      }
      // @ts-ignore
      return originalWriteHead(...args);
    };
    next();
  });

  // Security Headers
  app.use(helmet());

  // CORS Configuration
  if (!env.CORS_HANDLED_BY_PROXY) {
    const allowedOrigins = env.CORS_ORIGIN.split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            !origin ||
            allowedOrigins.includes('*') ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.raisefundz.com') ||
            origin === 'https://raisefundz.com' ||
            origin === 'https://www.raisefundz.com'
          ) {
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
        maxAge: 86400,
      })
    );
  }

  // Cookie parser
  app.use(cookieParser());

  // Request correlation tracking
  app.use(correlationIdMiddleware);

  // Structured HTTP logging (skip health checks for clean logs)
  if (env.NODE_ENV !== 'test') {
    app.use(
      pinoHttp({
        logger,
        // Keep request logs to one short line instead of dumping every header.
        serializers: {
          req: (req) => ({ method: req.method, url: req.url }),
          res: (res) => ({ statusCode: res.statusCode }),
        },
        customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
        customErrorMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
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

  // Direct USSD Gateway Webhook alias (supports /ussd and /ussd/nalo without api prefix)
  app.use(['/ussd', '/ussd/nalo'], ussdRuntimeRoutes);

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
