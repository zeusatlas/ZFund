import { env } from '../config/env';
import { arkeselSmsAdapter } from './arkesel-sms.adapter';
import { mockSmsAdapter } from './mock-sms.adapter';
import { mnotifySmsAdapter } from './mnotify-sms.adapter';
import { ISmsProvider } from './sms-provider.interface';

export class SmsProviderFactory {
  static getProvider(): ISmsProvider {
    switch (env.SMS_PROVIDER) {
      case 'mnotify':
        return mnotifySmsAdapter;
      case 'arkesel':
        return arkeselSmsAdapter;
      case 'mock':
      default:
        return mockSmsAdapter;
    }
  }
}
