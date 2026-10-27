import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { ISmsProvider, SendSmsParams, SendSmsResult } from './sms-provider.interface';

export class MockSmsAdapter implements ISmsProvider {
  readonly code = 'MOCK';
  public sentMessages: Array<SendSmsParams & { id: string; timestamp: Date }> = [];

  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    const id = `mock-sms-${uuidv4().slice(0, 8)}`;
    logger.info(
      {
        recipient: params.recipient,
        senderId: params.senderId,
        message: params.message,
        id,
      },
      '[MOCK SMS] Message dispatched successfully'
    );

    this.sentMessages.push({
      ...params,
      id,
      timestamp: new Date(),
    });

    return {
      success: true,
      provider: 'MOCK',
      providerMessageId: id,
      status: 'sent',
      rawResponse: { id, recipient: params.recipient, status: 'mock_delivered' },
    };
  }
}

export const mockSmsAdapter = new MockSmsAdapter();
