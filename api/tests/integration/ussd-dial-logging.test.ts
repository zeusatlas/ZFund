import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { Contributor } from '../../src/database/entities/contributor.entity';
import { UssdSession, UssdSessionStatus } from '../../src/database/entities/ussd-session.entity';
import { UssdSessionEvent } from '../../src/database/entities/ussd-session-event.entity';
import { AuditLog } from '../../src/database/entities/audit-log.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('USSD Dial Logging and Caller Tracking', () => {
  let app: any;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should track any caller who dials USSD into contributors table and audit logs even without donating', async () => {
    const testCallerPhone = '0549988776';
    const testSessionId = `test_dial_${Date.now()}`;

    // Contributor shouldn't exist initially
    const contributorRepo = AppDataSource.getRepository(Contributor);
    await contributorRepo.delete({ msisdn: testCallerPhone });

    // Simulate USSD initial dial
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALO_TEST',
        MSISDN: testCallerPhone,
        USERDATA: '*920*969#',
        MSGTYPE: true,
        SESSIONID: testSessionId,
        NETWORK: 'MTN',
      });

    expect(res.status).toBe(200);

    // Verify contributor was created
    const contributor = await contributorRepo.findOne({ where: { msisdn: testCallerPhone } });
    expect(contributor).toBeDefined();
    expect(contributor?.msisdn).toBe(testCallerPhone);

    // Verify session was created
    const sessionRepo = AppDataSource.getRepository(UssdSession);
    const session = await sessionRepo.findOne({ where: { sessionId: testSessionId } });
    expect(session).toBeDefined();
    expect(session?.msisdn).toBe(testCallerPhone);

    // Verify event was logged
    const eventRepo = AppDataSource.getRepository(UssdSessionEvent);
    const events = await eventRepo.find({ where: { msisdn: testCallerPhone } });
    expect(events.length).toBeGreaterThanOrEqual(1);

    // Verify audit log entry
    const auditRepo = AppDataSource.getRepository(AuditLog);
    const logs = await auditRepo.find({ where: { entityType: 'USSD_DIAL' }, order: { createdAt: 'DESC' } });
    const foundLog = logs.find((l) => (l.newValues as any)?.msisdn === testCallerPhone);
    expect(foundLog).toBeDefined();
  });

  it('should track and log rejected or invalid USSD dials in ussd_sessions and ussd_session_events', async () => {
    const invalidCallerPhone = '0241122334';
    const invalidSessionId = `rej_dial_${Date.now()}`;

    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALO_TEST',
        MSISDN: invalidCallerPhone,
        USERDATA: '*920*969*99999#', // Non-existent event code
        MSGTYPE: true,
        SESSIONID: invalidSessionId,
        NETWORK: 'TELECEL',
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(false); // Session ended

    // Caller must still be saved in contributors!
    const contributorRepo = AppDataSource.getRepository(Contributor);
    const contributor = await contributorRepo.findOne({ where: { msisdn: invalidCallerPhone } });
    expect(contributor).toBeDefined();

    // Session must be recorded in ussd_sessions as FAILED
    const sessionRepo = AppDataSource.getRepository(UssdSession);
    const session = await sessionRepo.findOne({ where: { sessionId: invalidSessionId } });
    expect(session).toBeDefined();
    expect(session?.status).toBe(UssdSessionStatus.FAILED);
    expect(['REJECTED', 'UNAVAILABLE']).toContain(session?.currentMenuKey);

    // Event must be recorded in ussd_session_events
    const eventRepo = AppDataSource.getRepository(UssdSessionEvent);
    const event = await eventRepo.findOne({ where: { ussdSessionId: session!.id } });
    expect(event).toBeDefined();
    expect(['REJECTED', 'UNAVAILABLE']).toContain(event?.menuKey);
  });

  it('should allow querying USSD dials and sessions via GET /api/v1/ussd/sessions', async () => {
    const res = await request(app)
      .get('/api/v1/ussd/sessions')
      .query({ limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });
});
