import { AppDataSource } from '../config/database';
import { cache } from '../config/redis';
import { UssdSession, UssdSessionStatus } from '../database/entities/ussd-session.entity';
import { UssdSessionEvent } from '../database/entities/ussd-session-event.entity';

const SESSION_TTL_SECONDS = 180; // 3 minutes

export class UssdSessionService {
  private get sessionRepo() { return AppDataSource.getRepository(UssdSession); }
  private get eventRepo() { return AppDataSource.getRepository(UssdSessionEvent); }

  /**
   * Acquires a short-lived concurrency lock for this session
   */
  async acquireLock(sessionId: string): Promise<boolean> {
    const lockKey = `ussd:lock:${sessionId}`;
    const exists = await cache.exists(lockKey);
    if (exists) return false;
    await cache.setex(lockKey, 5, '1');
    return true;
  }

  /**
   * Releases session concurrency lock
   */
  async releaseLock(sessionId: string): Promise<void> {
    await cache.del(`ussd:lock:${sessionId}`);
  }

  /**
   * Retrieves active session from Redis cache or falls back to PostgreSQL
   */
  async getSession(sessionId: string): Promise<UssdSession | null> {
    const cached = await cache.get(`ussd:session:${sessionId}`);
    if (cached) {
      try {
        return JSON.parse(cached) as UssdSession;
      } catch {
        // Fallback to database if parse fails
      }
    }

    const session = await this.sessionRepo.findOne({
      where: { sessionId, status: UssdSessionStatus.ACTIVE },
    });

    if (session) {
      if (new Date() > session.expiresAt) {
        session.status = UssdSessionStatus.EXPIRED;
        await this.sessionRepo.save(session);
        await cache.del(`ussd:session:${sessionId}`);
        return null;
      }
      // Populate cache
      await cache.setex(`ussd:session:${sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(session));
    }

    return session;
  }

  /**
   * Creates a new session in both Postgres and Redis
   */
  async createSession(params: {
    sessionId: string;
    msisdn: string;
    network?: string;
    provider?: string;
    projectId?: string;
    flowId?: string;
    flowVersionId?: string;
    initialMenuKey?: string;
    contextData?: Record<string, unknown>;
  }): Promise<UssdSession> {
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

    const session = this.sessionRepo.create({
      sessionId: params.sessionId,
      msisdn: params.msisdn,
      network: params.network,
      provider: params.provider || 'NALO',
      projectId: params.projectId,
      flowId: params.flowId,
      flowVersionId: params.flowVersionId,
      currentMenuKey: params.initialMenuKey || 'WELCOME',
      navigationHistory: [],
      contextData: params.contextData || {},
      status: UssdSessionStatus.ACTIVE,
      expiresAt,
    });

    const saved = await this.sessionRepo.save(session);

    await cache.setex(`ussd:session:${params.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(saved));
    return saved;
  }

  /**
   * Updates session in Postgres and Redis
   */
  async updateSession(session: UssdSession): Promise<void> {
    session.expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await this.sessionRepo.save(session);
    await cache.setex(`ussd:session:${session.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(session));
  }

  /**
   * Terminates session
   */
  async endSession(sessionId: string, status = UssdSessionStatus.COMPLETED): Promise<void> {
    await cache.del(`ussd:session:${sessionId}`);
    await this.sessionRepo.update({ sessionId }, { status });
  }

  /**
   * Records a USSD turn event for audit and diagnostics
   */
  async recordEvent(params: {
    ussdSessionId: string;
    msisdn: string;
    stepNumber: number;
    menuKey: string;
    userInput?: string;
    renderedMessage: string;
    actionExecuted?: string;
    msgType: boolean;
  }): Promise<void> {
    try {
      const event = this.eventRepo.create(params);
      await this.eventRepo.save(event);
    } catch {
      // Non-blocking diagnostic event write
    }
  }
}

export const ussdSessionService = new UssdSessionService();
