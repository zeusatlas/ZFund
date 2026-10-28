import { AppDataSource } from '../config/database';
import { ConflictError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { CryptoUtil } from '../common/utils/crypto';
import { normalizePhone } from '../common/utils/phone';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { smsService } from './sms.service';
import { auditService } from './audit.service';
import { User, UserStatus } from '../database/entities/user.entity';
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schemas';

export class UserService {
  private get userRepo() { return AppDataSource.getRepository(User); }

  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: SystemRole;
    status?: UserStatus;
    search?: string;
  }): Promise<{ users: User[]; total: number }> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const query = this.userRepo.createQueryBuilder('user');

    if (params.role) {
      query.andWhere('user.role = :role', { role: params.role });
    }
    if (params.status) {
      query.andWhere('user.status = :status', { status: params.status });
    }
    if (params.search) {
      query.andWhere(
        '(LOWER(user.email) LIKE :search OR LOWER(user.firstName) LIKE :search OR LOWER(user.lastName) LIKE :search)',
        { search: `%${params.search.toLowerCase()}%` }
      );
    }

    query.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [users, total] = await query.getManyAndCount();
    return { users, total };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['memberships', 'memberships.organization'],
    });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async createUser(
    input: CreateUserInput,
    actorId?: string
  ): Promise<{ user: User; smsSent: boolean }> {
    const existing = await this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: input.email })
      .getOne();
    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }
    await this.assertPhoneAvailable(input.phone);

    // Sign-in is by SMS code, so no usable password is ever issued.
    const passwordHash = await CryptoUtil.hashPassword(CryptoUtil.generateRandomString(48));
    const user = this.userRepo.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: normalizePhone(input.phone),
      role: input.role,
      // Becomes ACTIVE on first successful login.
      status: UserStatus.PENDING_VERIFICATION,
    });

    const saved = await this.userRepo.save(user);

    await auditService.log({
      userId: actorId,
      entityType: 'USER',
      entityId: saved.id,
      action: 'ADMIN_CREATE_USER',
      newValues: { email: saved.email, role: saved.role },
    });

    const sms = await smsService.send({
      recipient: normalizePhone(input.phone),
      message:
        `Welcome to ZFund, ${saved.firstName}. Your account is ready. ` +
        `Sign in at ${env.FRONTEND_URL}/login with your email (${saved.email}) ` +
        `and phone number (${saved.phone}). We'll text you a code each time.`,
    });
    if (!sms.success) {
      logger.error({ userId: saved.id, error: sms.error }, 'Failed to send account-created SMS');
    }

    // The saved entity still carries the hash; never hand it back to callers.
    const { passwordHash: _passwordHash, ...safeUser } = saved;
    return { user: safeUser as User, smsSent: sms.success };
  }

  /** Phones are stored normalised, so compare against both the normalised and raw forms. */
  private async assertPhoneAvailable(phone: string, excludeUserId?: string): Promise<void> {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .where('user.phone IN (:...phones)', { phones: [normalizePhone(phone), phone] });
    if (excludeUserId) qb.andWhere('user.id != :excludeUserId', { excludeUserId });
    if (await qb.getOne()) {
      throw new ConflictError('A user with this phone number already exists');
    }
  }

  async updateUser(id: string, input: UpdateUserInput, actorId?: string): Promise<User> {
    const user = await this.getUserById(id);
    const oldValues = { firstName: user.firstName, lastName: user.lastName, phone: user.phone };

    if (input.firstName !== undefined) user.firstName = input.firstName;
    if (input.lastName !== undefined) user.lastName = input.lastName;
    if (input.phone !== undefined) {
      await this.assertPhoneAvailable(input.phone, id);
      user.phone = normalizePhone(input.phone);
    }

    const saved = await this.userRepo.save(user);

    await auditService.log({
      userId: actorId,
      entityType: 'USER',
      entityId: saved.id,
      action: 'UPDATE_PROFILE',
      oldValues,
      newValues: input,
    });

    return saved;
  }

  async updateUserRole(id: string, role: SystemRole, actorId?: string): Promise<User> {
    const user = await this.getUserById(id);
    const oldRole = user.role;
    user.role = role;

    const saved = await this.userRepo.save(user);

    await auditService.log({
      userId: actorId,
      entityType: 'USER',
      entityId: saved.id,
      action: 'CHANGE_ROLE',
      oldValues: { role: oldRole },
      newValues: { role },
    });

    return saved;
  }

  async updateUserStatus(id: string, status: UserStatus, actorId?: string): Promise<User> {
    const user = await this.getUserById(id);
    const oldStatus = user.status;
    // Accounts that have never signed in stay pending until their first login.
    user.status =
      status === UserStatus.ACTIVE && !user.lastLoginAt ? UserStatus.PENDING_VERIFICATION : status;

    const saved = await this.userRepo.save(user);

    await auditService.log({
      userId: actorId,
      entityType: 'USER',
      entityId: saved.id,
      action: 'CHANGE_STATUS',
      oldValues: { status: oldStatus },
      newValues: { status },
    });

    return saved;
  }
}

export const userService = new UserService();
