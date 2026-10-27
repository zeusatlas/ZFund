import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { cache } from '../config/redis';

export class HealthController {
  async getHealth(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    });
  }

  async getReadiness(_req: Request, res: Response): Promise<Response> {
    let dbStatus = 'DOWN';
    let cacheStatus = 'DOWN';

    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1');
        dbStatus = 'UP';
      }
    } catch {
      dbStatus = 'DOWN';
    }

    try {
      cacheStatus = cache.isReady() ? 'UP' : 'DEGRADED';
    } catch {
      cacheStatus = 'DOWN';
    }

    const isReady = dbStatus === 'UP';

    return res.status(isReady ? 200 : 503).json({
      status: isReady ? 'READY' : 'NOT_READY',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
        cache: cacheStatus,
      },
      memoryUsage: process.memoryUsage(),
    });
  }
}

export const healthController = new HealthController();
