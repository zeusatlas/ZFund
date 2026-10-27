import { newDb, IMemoryDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { allEntities } from '../src/database/entities';
import { AppDataSource } from '../src/config/database';

let testDb: IMemoryDb;
let testDataSource: DataSource;

export async function setupTestDatabase(): Promise<DataSource> {
  testDb = newDb({ autoCreateForeignKeyIndices: true });

  testDb.public.registerFunction({
    implementation: () => 'zfund_test_db',
    name: 'current_database',
  });
  testDb.public.registerFunction({
    implementation: () => 'PostgreSQL 17.0',
    name: 'version',
  });
  testDb.public.registerFunction({
    implementation: () => require('uuid').v4(),
    name: 'uuid_generate_v4',
    impure: true,
  });

  testDataSource = await testDb.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: allEntities,
    synchronize: true,
  });

  await testDataSource.initialize();

  // Swap AppDataSource internals so repositories in services use this in-memory test DataSource
  Object.assign(AppDataSource, {
    manager: testDataSource.manager,
    getRepository: (target: any) => testDataSource.getRepository(target),
    isInitialized: true,
    query: (query: string, parameters?: any[]) => testDataSource.query(query, parameters),
    transaction: (fn: any) => testDataSource.transaction(fn),
  });

  return testDataSource;
}

export async function closeTestDatabase(): Promise<void> {
  if (testDataSource && testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}
