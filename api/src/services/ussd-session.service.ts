import { AppDataSource } from '../config/database';
import { cache } from '../config/redis';
import { UssdSession, UssdSessionStatus } from '../database/entities/ussd-session.entity';
import { UssdSessionEvent } from '../database/entities/ussd-session-event.entity';

const SESSION_TTL_SECONDS = 180; // 3 minutes

export class UssdSessionService {
  private get sessionRepo() { return AppDataSource.getRepository(UssdSession); }
  private get eventRepo() { return AppDataSource.getRepository(UssdSessionEvent); }

  /**
   * Acquires a short-lived concurrency lock for this session/MSISDN
   */
  async acquireLock(lockIdentifier: string): Promise<boolean> {
    const lockKey = `ussd:lock:${lockIdentifier}`;
    const exists = await cache.exists(lockKey);
    if (exists) return false;
    await cache.setex(lockKey, 5, '1');
    return true;
  }

  /**
   * Releases session concurrency lock
   */
  async releaseLock(lockIdentifier: string): Promise<void> {
    await cache.del(`ussd:lock:${lockIdentifier}`);
  }

  /**
   * Retrieves active session from Redis cache or falls back to PostgreSQL by sessionId
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
        await cache.del(`ussd:active_msisdn:${session.msisdn}`);
        return null;
      }
      // Populate cache
      await cache.setex(`ussd:session:${sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(session));
      await cache.setex(`ussd:active_msisdn:${session.msisdn}`, SESSION_TTL_SECONDS, session.sessionId);
    }

    return session;
  }

  /**
   * Retrieves active session by MSISDN (standard NALO session tracking)
   */
  async getActiveSessionByMsisdn(msisdn: string): Promise<UssdSession | null> {
    const activeSessionId = await cache.get(`ussd:active_msisdn:${msisdn}`);
    if (activeSessionId) {
      const session = await this.getSession(activeSessionId);
      if (session && session.status === UssdSessionStatus.ACTIVE) {
        return session;
      }
    }

    const session = await this.sessionRepo.findOne({
      where: { msisdn, status: UssdSessionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (session) {
      if (new Date() > session.expiresAt) {
        session.status = UssdSessionStatus.EXPIRED;
        await this.sessionRepo.save(session);
        await cache.del(`ussd:session:${session.sessionId}`);
        await cache.del(`ussd:active_msisdn:${msisdn}`);
        return null;
      }
      await cache.setex(`ussd:active_msisdn:${msisdn}`, SESSION_TTL_SECONDS, session.sessionId);
      await cache.setex(`ussd:session:${session.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(session));
    }

    return session;
  }

  /**
   * Creates a new session in both Postgres and Redis, expiring any lingering previous session for this MSISDN
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
    // End any existing active sessions for this MSISDN first (e.g. user re-dialed)
    await this.endActiveSessionsForMsisdn(params.msisdn);

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
    await cache.setex(`ussd:active_msisdn:${params.msisdn}`, SESSION_TTL_SECONDS, params.sessionId);
    return saved;
  }

  /**
   * Updates session in Postgres and Redis
   */
  async updateSession(session: UssdSession): Promise<void> {
    session.expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await this.sessionRepo.save(session);
    await cache.setex(`ussd:session:${session.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(session));
    await cache.setex(`ussd:active_msisdn:${session.msisdn}`, SESSION_TTL_SECONDS, session.sessionId);
  }

  /**
   * Terminates session
   */
  async endSession(sessionId: string, status = UssdSessionStatus.COMPLETED): Promise<void> {
    const session = await this.sessionRepo.findOne({ where: { sessionId } });
    if (session) {
      session.status = status;
      await this.sessionRepo.save(session);
      await cache.del(`ussd:active_msisdn:${session.msisdn}`);
    }
    await cache.del(`ussd:session:${sessionId}`);
  }

  /**
   * Ends all active sessions for an MSISDN (used on initial dial)
   */
  async endActiveSessionsForMsisdn(msisdn: string): Promise<void> {
    const activeSessionId = await cache.get(`ussd:active_msisdn:${msisdn}`);
    if (activeSessionId) {
      await cache.del(`ussd:session:${activeSessionId}`);
      await cache.del(`ussd:active_msisdn:${msisdn}`);
    }
    await this.sessionRepo.update(
      { msisdn, status: UssdSessionStatus.ACTIVE },
      { status: UssdSessionStatus.EXPIRED }
    );
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
