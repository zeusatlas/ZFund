import crypto from 'crypto';
import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
  AppError,
} from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { CryptoUtil } from '../common/utils/crypto';
import { normalizePhone } from '../common/utils/phone';
import { auditService } from './audit.service';
import { smsService } from './sms.service';
import { AuthEvent, AuthEventType } from '../database/entities/auth-event.entity';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { User, UserStatus } from '../database/entities/user.entity';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  RequestOtpInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from '../schemas/auth.schemas';

const OTP_TTL_MINUTES = 2;
const OTP_MAX_ATTEMPTS = 5;
const OTP_WARN_AFTER_ATTEMPTS = 3;
// A new code can only be requested once the current one has run out.
const OTP_RESEND_SECONDS = OTP_TTL_MINUTES * 60;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: SystemRole;
    status: UserStatus;
  };
}

export class AuthService {
  private get userRepo() { return AppDataSource.getRepository(User); }
  private get refreshTokenRepo() { return AppDataSource.getRepository(RefreshToken); }
  private get passwordResetRepo() { return AppDataSource.getRepository(PasswordResetToken); }
  private get authEventRepo() { return AppDataSource.getRepository(AuthEvent); }

  /**
   * Starts a sign-in: when the email and phone match an account, texts a one-time code.
   * The outcome is deliberately identical for unknown accounts to avoid user enumeration.
   */
  async requestOtp(input: RequestOtpInput, ipAddress?: string, userAgent?: string): Promise<void> {
    const user = await this.findOtpUser(input.email);

    if (!user?.phone || normalizePhone(user.phone) !== normalizePhone(input.phone)) {
      await this.recordAuthEvent({
        userId: user?.id,
        eventType: AuthEventType.LOGIN_FAILED,
        email: input.email,
        ipAddress,
        userAgent,
        metadata: { reason: 'OTP_REQUEST_NO_MATCH' },
      });
      return;
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError('Account is suspended. Please contact platform administration.');
    }

    if (user.otpSentAt && Date.now() - user.otpSentAt.getTime() < OTP_RESEND_SECONDS * 1000) {
      throw new TooManyRequestsError('Please wait before requesting another code');
    }

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    user.otpHash = this.hashOtp(user.id, code);
    user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    user.otpAttempts = 0;
    user.otpSentAt = new Date();
    await this.userRepo.save(user);

    const sms = await smsService.send({
      recipient: normalizePhone(user.phone),
      message: `Your RaiseFunds sign-in code is ${code}. It expires in ${OTP_TTL_MINUTES} minutes. Do not share it with anyone.`,
    });
    if (!sms.success) {
      logger.error({ userId: user.id, error: sms.error }, 'Failed to send sign-in code');
      throw new AppError('We could not send your code. Please try again shortly.', 503);
    }
  }

  async verifyOtp(input: VerifyOtpInput, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const user = await this.findOtpUser(input.email);
    const invalid = new UnauthorizedError('Invalid or expired code');

    if (!user?.phone || normalizePhone(user.phone) !== normalizePhone(input.phone)) throw invalid;

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError('Account is suspended. Please contact platform administration.');
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      throw new TooManyRequestsError(
        'Too many incorrect attempts. You can request a new code after some time.'
      );
    }

    if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) throw invalid;

    const expected = Buffer.from(user.otpHash);
    const actual = Buffer.from(this.hashOtp(user.id, input.code));
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      user.otpAttempts += 1;
      const locked = user.otpAttempts >= OTP_MAX_ATTEMPTS;
      if (locked) user.otpHash = null;
      await this.userRepo.save(user);
      await this.recordAuthEvent({
        userId: user.id,
        eventType: AuthEventType.LOGIN_FAILED,
        email: user.email,
        ipAddress,
        userAgent,
        metadata: { reason: locked ? 'OTP_LOCKED' : 'INVALID_OTP' },
      });
      if (locked) {
        throw new TooManyRequestsError(
          'Too many incorrect attempts. You can request a new code after some time.'
        );
      }
      if (user.otpAttempts >= OTP_WARN_AFTER_ATTEMPTS) {
        const left = OTP_MAX_ATTEMPTS - user.otpAttempts;
        throw new UnauthorizedError(`Invalid code. You have ${left} attempt${left === 1 ? '' : 's'} left.`);
      }
      throw invalid;
    }

    // Codes are single-use. A first successful sign-in activates a pending account.
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    user.lastLoginAt = new Date();
    if (user.status === UserStatus.PENDING_VERIFICATION) {
      user.status = UserStatus.ACTIVE;
    }
    await this.userRepo.save(user);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = CryptoUtil.generateAccessToken(tokenPayload);
    const refreshToken = CryptoUtil.generateRefreshToken(tokenPayload);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        userId: user.id,
        tokenHash: CryptoUtil.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        ipAddress,
        userAgent,
      })
    );

    await this.recordAuthEvent({
      userId: user.id,
      eventType: AuthEventType.LOGIN_SUCCESS,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  private findOtpUser(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect(['user.otpHash', 'user.otpExpiresAt', 'user.otpAttempts', 'user.otpSentAt'])
      .where('user.email = :email', { email })
      .getOne();
  }

  private hashOtp(userId: string, code: string): string {
    return CryptoUtil.hashToken(`${userId}:${code}`);
  }

  async refreshToken(oldRefreshToken: string, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = CryptoUtil.verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokenHash = CryptoUtil.hashToken(oldRefreshToken);
    const storedToken = await this.refreshTokenRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!storedToken || storedToken.isRevoked) {
      // Possible token replay attack - revoke all user tokens for safety
      if (payload.userId) {
        await this.revokeAllTokens(payload.userId);
      }
      throw new UnauthorizedError('Refresh token revoked or invalid');
    }

    if (new Date() > storedToken.expiresAt) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepo.save(storedToken);
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = storedToken.user;
    if (!user || user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError('Account is inactive or suspended');
    }

    // Rotate refresh token: revoke current token and issue new pair
    storedToken.isRevoked = true;
    await this.refreshTokenRepo.save(storedToken);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = CryptoUtil.generateAccessToken(tokenPayload);
    const newRefreshToken = CryptoUtil.generateRefreshToken(tokenPayload);

    const newTokenHash = CryptoUtil.hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        userId: user.id,
        tokenHash: newTokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      })
    );

    await this.recordAuthEvent({
      userId: user.id,
      eventType: AuthEventType.TOKEN_REFRESH,
      email: user.email,
      ipAddress,
      userAgent,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  async logout(refreshTokenString: string): Promise<void> {
    if (!refreshTokenString) return;
    const tokenHash = CryptoUtil.hashToken(refreshTokenString);
    await this.refreshTokenRepo.update({ tokenHash }, { isRevoked: true });
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo.update({ userId, isRevoked: false }, { isRevoked: true });
    await this.recordAuthEvent({
      userId,
      eventType: AuthEventType.LOGOUT_ALL,
    });
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await CryptoUtil.verifyPassword(user.passwordHash, input.oldPassword);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    user.passwordHash = await CryptoUtil.hashPassword(input.newPassword);
    await this.userRepo.save(user);

    // Revoke all tokens on password change
    await this.revokeAllTokens(userId);

    await this.recordAuthEvent({
      userId,
      eventType: AuthEventType.PASSWORD_CHANGE,
      email: user.email,
    });

    await auditService.log({
      userId,
      entityType: 'USER',
      entityId: userId,
      action: 'PASSWORD_CHANGE',
    });
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<{ resetToken: string }> {
    const user = await this.userRepo.findOne({ where: { email: input.email } });
    if (!user) {
      // Return benign response to prevent user enumeration
      return { resetToken: 'benign_token' };
    }

    const rawToken = CryptoUtil.generateRandomString(32);
    const tokenHash = CryptoUtil.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.passwordResetRepo.save(
      this.passwordResetRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      })
    );

    await this.recordAuthEvent({
      userId: user.id,
      eventType: AuthEventType.PASSWORD_RESET_REQUEST,
      email: user.email,
    });

    return { resetToken: rawToken };
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = CryptoUtil.hashToken(input.token);
    const resetRecord = await this.passwordResetRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!resetRecord || resetRecord.isUsed || new Date() > resetRecord.expiresAt) {
      throw new BadRequestError('Password reset token is invalid or has expired');
    }

    const user = resetRecord.user;
    user.passwordHash = await CryptoUtil.hashPassword(input.newPassword);
    await this.userRepo.save(user);

    resetRecord.isUsed = true;
    await this.passwordResetRepo.save(resetRecord);

    await this.revokeAllTokens(user.id);

    await this.recordAuthEvent({
      userId: user.id,
      eventType: AuthEventType.PASSWORD_RESET_COMPLETE,
      email: user.email,
    });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['memberships', 'memberships.organization'],
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  private async recordAuthEvent(params: {
    userId?: string;
    eventType: AuthEventType;
    email?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.authEventRepo.save(
        this.authEventRepo.create({
          userId: params.userId,
          eventType: params.eventType,
          email: params.email,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: params.metadata,
        })
      );
    } catch {
      // Auth event logging failure should not break authentication
    }
  }
}

export const authService = new AuthService();
