import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RaiseFunds Backend API',
      version: '1.0.0',
      description:
        'RaiseFunds API - Contribution Management Platform with Database-Driven USSD Engine, RobsPay Payments, and Multi-Provider SMS Notifications',
      contact: {
        name: 'RaiseFunds Engineering Team',
        email: 'engineering@raisefundz.com',
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
