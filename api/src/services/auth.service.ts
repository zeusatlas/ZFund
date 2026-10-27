import { AppDataSource } from '../config/database';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { CryptoUtil } from '../common/utils/crypto';
import { auditService } from './audit.service';
import { AuthEvent, AuthEventType } from '../database/entities/auth-event.entity';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity';
import { RefreshToken } from '../database/entities/refresh-token.entity';
import { User, UserStatus } from '../database/entities/user.entity';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '../schemas/auth.schemas';

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

  async register(input: RegisterInput, ipAddress?: string, userAgent?: string): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await CryptoUtil.hashPassword(input.password);
    const user = this.userRepo.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.role || SystemRole.ACCOUNT_OWNER,
      status: UserStatus.ACTIVE,
    });

    const savedUser = await this.userRepo.save(user);

    await this.recordAuthEvent({
      userId: savedUser.id,
      eventType: AuthEventType.LOGIN_SUCCESS,
      email: savedUser.email,
      ipAddress,
      userAgent,
      metadata: { action: 'USER_REGISTERED' },
    });

    await auditService.log({
      userId: savedUser.id,
      entityType: 'USER',
      entityId: savedUser.id,
      action: 'REGISTER',
      ipAddress,
      userAgent,
    });

    return savedUser;
  }

  async login(input: LoginInput, ipAddress?: string, userAgent?: string): Promise<AuthTokens> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: input.email })
      .getOne();

    if (!user) {
      await this.recordAuthEvent({
        eventType: AuthEventType.LOGIN_FAILED,
        email: input.email,
        ipAddress,
        userAgent,
        metadata: { reason: 'USER_NOT_FOUND' },
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      await this.recordAuthEvent({
        userId: user.id,
        eventType: AuthEventType.LOGIN_FAILED,
        email: input.email,
        ipAddress,
        userAgent,
        metadata: { reason: 'ACCOUNT_SUSPENDED' },
      });
      throw new ForbiddenError('Account is suspended. Please contact platform administration.');
    }

    const isValidPassword = await CryptoUtil.verifyPassword(user.passwordHash, input.password);
    if (!isValidPassword) {
      await this.recordAuthEvent({
        userId: user.id,
        eventType: AuthEventType.LOGIN_FAILED,
        email: input.email,
        ipAddress,
        userAgent,
        metadata: { reason: 'INVALID_CREDENTIALS' },
      });
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update lastLoginAt
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = CryptoUtil.generateAccessToken(tokenPayload);
    const refreshToken = CryptoUtil.generateRefreshToken(tokenPayload);

    // Store hashed refresh token in database
    const tokenHash = CryptoUtil.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt,
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
