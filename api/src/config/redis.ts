import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export interface ICacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<'OK' | null>;
  setex(key: string, seconds: number, value: string): Promise<'OK' | null>;
  del(key: string | string[]): Promise<number>;
  exists(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  flushall(): Promise<'OK'>;
  isReady(): boolean;
}

class InMemoryCacheClient implements ICacheClient {
  private store = new Map<string, { value: string; expiry?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string): Promise<'OK' | null> {
    this.store.set(key, { value });
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK' | null> {
    this.store.set(key, {
      value,
      expiry: Date.now() + seconds * 1000,
    });
    return 'OK';
  }

  async del(key: string | string[]): Promise<number> {
    const keys = Array.isArray(key) ? key : [key];
    let count = 0;
    for (const k of keys) {
      if (this.store.delete(k)) count++;
    }
    return count;
  }

  async exists(key: string): Promise<number> {
    const val = await this.get(key);
    return val !== null ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const num = (parseInt(current || '0', 10) || 0) + 1;
    await this.set(key, String(num));
    return num;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiry = Date.now() + seconds * 1000;
    this.store.set(key, item);
    return 1;
  }

  async flushall(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }

  isReady(): boolean {
    return true;
  }
}

class RedisCacheClient implements ICacheClient {
  private client: Redis;
  private ready = false;

  constructor() {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD || undefined,
      db: env.REDIS_DB,
      keyPrefix: env.REDIS_KEY_PREFIX,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.ready = true;
      logger.info('Connected to Redis server');
    });

    this.client.on('error', (err) => {
      this.ready = false;
      logger.warn({ err: err.message }, 'Redis error');
    });

    this.client.on('close', () => {
      this.ready = false;
    });

    this.client.connect().catch((err) => {
      logger.warn({ err: err.message }, 'Initial Redis connection failed, cache operations may degrade');
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<'OK' | null> {
    return this.client.set(key, value) as Promise<'OK' | null>;
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK' | null> {
    return this.client.setex(key, seconds, value) as Promise<'OK' | null>;
  }

  async del(key: string | string[]): Promise<number> {
    if (Array.isArray(key)) {
      return this.client.del(...key);
    }
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async flushall(): Promise<'OK'> {
    return this.client.flushall() as Promise<'OK'>;
  }

  isReady(): boolean {
    return this.ready;
  }
}

export const cache: ICacheClient =
  env.REDIS_ENABLED && env.NODE_ENV !== 'test'
    ? new RedisCacheClient()
    : new InMemoryCacheClient();
