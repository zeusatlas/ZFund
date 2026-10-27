import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { allEntities } from '../database/entities';
import { env } from './env';
import { logger } from './logger';

// Explicit environment-aware synchronization guard
function determineSynchronize(): boolean {
  if (env.NODE_ENV === 'production') {
    if (env.TYPEORM_SYNCHRONIZE) {
      logger.warn(
        'CAUTION: TypeORM synchronization is active in PRODUCTION. Schema will be synchronized according to entity definitions.'
      );
      return true;
    }
    return false;
  }
  // In development and test, use configured setting (defaults to true)
  return env.TYPEORM_SYNCHRONIZE;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  entities: allEntities,
  synchronize: determineSynchronize(),
  logging: env.TYPEORM_LOGGING,
  dropSchema: false, // Never drop schema automatically
  extra: {
    max: 25,
    connectionTimeoutMillis: 5000,
  },
});

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  try {
    await AppDataSource.initialize();
    logger.info(
      {
        database: env.DB_NAME,
        entitiesCount: allEntities.length,
        synchronize: AppDataSource.options.synchronize,
      },
      'PostgreSQL Database connection initialized successfully with TypeORM entity synchronization'
    );
    return AppDataSource;
  } catch (error) {
    logger.error({ error }, 'Failed to initialize database connection');
    throw error;
  }
}
