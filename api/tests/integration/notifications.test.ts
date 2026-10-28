import request from 'supertest';
import axios from 'axios';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import { Notification, NotificationStatus } from '../../src/database/entities/notification.entity';
import { NotificationTemplate, NotificationChannel } from '../../src/database/entities/notification-template.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';
import { notificationService } from '../../src/services/notification.service';
import { MNotifySmsAdapter } from '../../src/services/mnotify-sms.adapter';
import { smsService } from '../../src/services/sms.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Notification & SMS Integration Tests', () => {
  let app: any;
  let superAdminToken: string;
  let regularUserToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const passwordHash = await CryptoUtil.hashPassword('AdminPassword123');

    const admin = await userRepo.save(
      userRepo.create({
        email: 'notify.admin@zfund.org',
        passwordHash,
        firstName: 'Notify',
        lastName: 'Admin',
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      })
    );
    superAdminToken = CryptoUtil.generateAccessToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const regular = await userRepo.save(
      userRepo.create({
        email: 'contributor.user@zfund.org',
        passwordHash,
        firstName: 'Regular',
        lastName: 'Contributor',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );
    regularUserToken = CryptoUtil.generateAccessToken({
      userId: regular.id,
      email: regular.email,
      role: regular.role,
    });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('mNotify Gateway & Credit Calculations (ZDesk Protocol)', () => {
    it('should correctly detect GSM-7 vs Unicode characters', () => {
      expect(MNotifySmsAdapter.isUnicode('Thank you for your donation of GHS 50.00')).toBe(false);
      expect(MNotifySmsAdapter.isUnicode('God bless you! 💖 Ref: ZF-1001')).toBe(true);
      expect(MNotifySmsAdapter.isUnicode('Café contribution')).toBe(true);
    });

    it('should calculate SMS credits accurately based on message length and encoding', () => {
      // GSM-7: 1-160 chars = 1 credit, 161-306 = 2 credits
      const shortGsm = 'Hello from ZFund! Your contribution of GHS 10.00 has been received.';
      expect(MNotifySmsAdapter.calculateSMSCredits(shortGsm, 1)).toBe(1);

      const longGsm = 'A'.repeat(165);
      expect(MNotifySmsAdapter.calculateSMSCredits(longGsm, 1)).toBe(2);

      // Unicode: 1-70 chars = 1 credit, 71-134 = 2 credits
      const shortUnicode = 'Blessings! 💖 GHS 10.00';
      expect(MNotifySmsAdapter.calculateSMSCredits(shortUnicode, 1)).toBe(1);

      const longUnicode = '🌟'.repeat(40); // 80 UTF-16 code units
      expect(MNotifySmsAdapter.calculateSMSCredits(longUnicode, 1)).toBe(2);
    });

    it('should dispatch SMS using mNotify format and handle successful provider response', async () => {
      const adapter = new MNotifySmsAdapter('test_mnotify_key_123');
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status: 'success',
          code: '1000',
          message: 'Message sent successfully',
          summary: {
            _id: 'mnotify-msg-999',
            type: 'quick',
            total_sent: 1,
            contacts: 1,
            total_rejected: 0,
            numbers_sent: ['233240000001'],
            credit_used: 1,
            credit_left: 499,
          },
        },
      });

      const res = await adapter.sendSms({
        recipient: '233240000001',
        message: 'Your donation of GHS 50.00 was confirmed. Ref: ZF-TEST-01',
        senderId: 'ZFund',
      });

      expect(res.success).toBe(true);
      expect(res.provider).toBe('MNOTIFY');
      expect(res.providerMessageId).toBe('mnotify-msg-999');
    });

    it('should dispatch OTP SMS with sms_type: "otp" following ZDesk logic', async () => {
      const adapter = new MNotifySmsAdapter('test_mnotify_key_123');
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status: 'success',
          code: '1000',
          message: 'OTP sent successfully',
          summary: {
            _id: 'mnotify-otp-888',
            type: 'otp',
            total_sent: 1,
            contacts: 1,
            total_rejected: 0,
            numbers_sent: ['233240000002'],
            credit_used: 1,
            credit_left: 498,
          },
        },
      });

      const res = await adapter.sendOTP('233240000002', 'Your ZFund verification code is 492019');

      expect(res.success).toBe(true);
      expect(res.provider).toBe('MNOTIFY');
      expect(res.providerMessageId).toBe('mnotify-otp-888');

      // Verify that sms_type: 'otp' was passed in payload to mNotify
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('api.mnotify.com'),
        expect.objectContaining({
          sms_type: 'otp',
          message: 'Your ZFund verification code is 492019',
        }),
        expect.anything()
      );
    });
  });

  describe('Notification Template Rendering & Safe Dispatch', () => {
    it('should render notification with dynamic template placeholders', async () => {
      const templateRepo = AppDataSource.getRepository(NotificationTemplate);
      await templateRepo.save(
        templateRepo.create({
          templateKey: 'PAYMENT_SUCCESS_SMS',
          channel: NotificationChannel.SMS,
          title: 'Payment Success SMS',
          eventType: 'PAYMENT_CONFIRMED',
          messageTemplate: 'Dear {contributorName}, your gift of GHS {amount} to {projectName} has been confirmed. Ref: {reference}.',
          approvedPlaceholders: ['contributorName', 'amount', 'projectName', 'reference'],
          isActive: true,
        })
      );

      const notification = await notificationService.sendNotification({
        templateKey: 'PAYMENT_SUCCESS_SMS',
        recipientPhone: '233240000001',
        eventType: 'PAYMENT_CONFIRMED',
        variables: {
          contributorName: 'Kwame',
          amount: '100.00',
          projectName: 'Church Building Fund',
          reference: 'ZF-REF-888',
        },
      });

      expect(notification).toBeDefined();
      expect(notification.messageBody).toBe(
        'Dear Kwame, your gift of GHS 100.00 to Church Building Fund has been confirmed. Ref: ZF-REF-888.'
      );
      expect(notification.status).toBeDefined();
    });

    it('should fallback gracefully when template is not found in database', async () => {
      const notification = await notificationService.sendNotification({
        templateKey: 'NON_EXISTENT_TEMPLATE',
        recipientPhone: '233240000002',
        eventType: 'REFUND_PROCESSED',
        variables: {
          reference: 'RF-999',
        },
      });

      expect(notification.messageBody).toContain('Notification for event REFUND_PROCESSED');
      expect(notification.messageBody).toContain('RF-999');
    });
  });

  describe('Notifications API Endpoints', () => {
    it('POST /api/v1/notifications/test-sms should send test SMS for super admin', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/test-sms')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          recipient: '233240000001',
          message: 'Automated Test SMS verification from ZFund integration test',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.success).toBe(true);
    });

    it('POST /api/v1/notifications/test-sms should be forbidden (403) for non-admin', async () => {
      const res = await request(app)
        .post('/api/v1/notifications/test-sms')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({
          recipient: '233240000001',
          message: 'Unauthorized test',
        });

      expect(res.status).toBe(403);
    });

    it('GET /api/v1/notifications should return paginated notifications for admin', async () => {
      const res = await request(app)
        .get('/api/v1/notifications?page=1&limit=10')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
    });

    it('POST /api/v1/notifications/:id/retry should re-queue failed notification', async () => {
      const notifRepo = AppDataSource.getRepository(Notification);
      const failed = await notifRepo.save(
        notifRepo.create({
          templateKey: 'TEST_RETRY',
          recipientPhone: '233240000009',
          channel: NotificationChannel.SMS,
          eventType: 'TEST_FAIL',
          messageBody: 'Retry test message',
          status: NotificationStatus.FAILED,
          errorDetails: 'Simulated connection timeout',
        })
      );

      const res = await request(app)
        .post(`/api/v1/notifications/${failed.id}/retry`)
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
