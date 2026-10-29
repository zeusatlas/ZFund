import argon2 from 'argon2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  organizationId?: string | null;
}

export class CryptoUtil {
  /**
   * Hashes a password using Argon2id with configured time/memory cost
   */
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
    });
  }

  /**
   * Verifies a plain password against an Argon2 hash
   */
  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Generates a short-lived JWT access token
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Generates a long-lived JWT refresh token with unique jti identifier
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      { ...payload, jti: crypto.randomUUID() },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      }
    );
  }

  /**
   * Verifies an access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  }

  /**
   * Verifies a refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  }

  /**
   * Hashes a token (e.g. refresh token or password reset token) with SHA-256 for secure database storage
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a cryptographically secure random alphanumeric string
   */
  static generateRandomString(length = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  /**
   * Generates a formatted payment or transaction reference (e.g. ZF-PAY-XXXX-XXXX)
   */
  static generateReference(prefix = 'ZF'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Generates a secure random 12-character uppercase hex transaction ID for RobsPay
   */
  static generateRobspayOrderId(): string {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
  }

  /**
   * Generates RobsPay HMAC-SHA256 signature from (payload + timestamp) using API key
   */
  static generateRobspaySignature(payload: string, timestamp: string, apiKey = env.ROBSPAY_API_KEY): string {
    const signatureString = payload + timestamp;
    return crypto
      .createHmac('sha256', apiKey)
      .update(signatureString)
      .digest('hex');
  }

  /**
   * Verifies RobsPay HMAC-SHA256 signature
   */
  static verifyRobspaySignature(
    payload: string | Buffer,
    signature: string,
    timestamp = '',
    apiKey = env.ROBSPAY_API_KEY
  ): boolean {
    if (!signature) return false;
    const bodyStr = typeof payload === 'string' ? payload : payload.toString('utf8');
    const computed = this.generateRobspaySignature(bodyStr, timestamp, apiKey);
    const computedBuf = Buffer.from(computed);
    const signatureBuf = Buffer.from(signature);
    if (computedBuf.length !== signatureBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, signatureBuf);
  }

  /**
   * Verifies Paystack HMAC SHA512 signature against raw request body
   */
  static verifyPaystackSignature(
    rawBody: string | Buffer,
    signature: string,
    secretKey = env.PAYSTACK_SECRET_KEY
  ): boolean {
    if (!signature || !secretKey) return false;
    const computed = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody)
      .digest('hex');
    const computedBuf = Buffer.from(computed);
    const signatureBuf = Buffer.from(signature);
    if (computedBuf.length !== signatureBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, signatureBuf);
  }
}
