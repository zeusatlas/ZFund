import { AuthenticatedUser } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      correlationId?: string;
      rawBody?: Buffer | string;
    }
  }
}

export {};
