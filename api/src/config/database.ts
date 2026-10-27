import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { allEntities } from '../database/entities';
import { env } from './env';
import { logger } from './logger';



export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
  entities: allEntities,
  synchronize: true,
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
  } catch (error: any) {
    // If the database does not exist (PostgreSQL error code 3D000) and we are not in production, attempt to create it
    if (error?.code === '3D000' && env.NODE_ENV !== 'production') {
      try {
        logger.info(`Database "${env.DB_NAME}" does not exist. Attempting to create it automatically...`);
        const { Client } = await import('pg');
        const defaultClient = new Client({
          host: env.DB_HOST,
          port: env.DB_PORT,
          user: env.DB_USERNAME,
          password: env.DB_PASSWORD,
          database: 'postgres',
          ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
        });
        await defaultClient.connect();
        await defaultClient.query(`CREATE DATABASE "${env.DB_NAME.replace(/"/g, '""')}"`);
        await defaultClient.end();
        logger.info(`Database "${env.DB_NAME}" created successfully. Retrying connection...`);

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
      } catch (creationError) {
        logger.error({ err: creationError }, 'Failed to automatically create database');
      }
    }

    logger.error({ err: error }, 'Failed to initialize database connection');
    throw error;
  }
}
