import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'pin',
      'token',
      'refreshToken',
      'secret',
      'key',
      'ROBSPAY_API_KEY',
      'SMS_API_KEY',
      'body.password',
      'body.pin',
      'body.token',
      'body.refreshToken',
      '*.password',
      '*.pin',
      '*.secretKey',
    ],
    censor: '[REDACTED]',
  },
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
