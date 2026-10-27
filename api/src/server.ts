import http from 'http';
import { createApp } from './app';
import { AppDataSource, initializeDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  try {
    logger.info('Starting ZFund Backend Server...');

    // Initialize PostgreSQL Database with TypeORM Entity Synchronization
    await initializeDatabase();

    const app = createApp();
    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
          apiPrefix: env.API_PREFIX,
          docsUrl: `http://localhost:${env.PORT}/api-docs`,
        },
        `🚀 ZFund API is running successfully at http://localhost:${env.PORT}`
      );
    });

    // Graceful Shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down server...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          logger.info('Database connection closed.');
        }
        process.exit(0);
      });

      // Force shutdown after 10s timeout
      setTimeout(() => {
        logger.error('Forcefully terminating process after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.fatal({ error }, 'Fatal error during application startup');
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

export { bootstrap };
