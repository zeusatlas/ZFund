import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZFund Backend API',
      version: '1.0.0',
      description:
        'ZFund API - Contribution Management Platform with Database-Driven USSD Engine, Paystack Payments, and Multi-Provider SMS Notifications',
      contact: {
        name: 'ZFund Engineering Team',
        email: 'engineering@zfund.org',
      },
    },
    servers: [
      {
        url: `${env.API_BASE_URL}${env.API_PREFIX}`,
        description: `${env.NODE_ENV} server`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT access token obtained from /auth/verify-otp or /auth/refresh-token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './dist/modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
