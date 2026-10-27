import { AppDataSource } from '../config/database';
import { ConflictError, NotFoundError } from '../common/errors/app-error';
import { SystemRole } from '../common/types/auth';
import { CryptoUtil } from '../common/utils/crypto';
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

  async createUser(input: CreateUserInput, actorId?: string): Promise<User> {
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
      role: input.role,
      status: UserStatus.ACTIVE,
    });

    const saved = await this.userRepo.save(user);

    await auditService.log({
      userId: actorId,
      entityType: 'USER',
      entityId: saved.id,
      action: 'ADMIN_CREATE_USER',
      newValues: { email: saved.email, role: saved.role },
    });

    return saved;
  }

  async updateUser(id: string, input: UpdateUserInput, actorId?: string): Promise<User> {
    const user = await this.getUserById(id);
    const oldValues = { firstName: user.firstName, lastName: user.lastName, phone: user.phone };

    if (input.firstName !== undefined) user.firstName = input.firstName;
    if (input.lastName !== undefined) user.lastName = input.lastName;
    if (input.phone !== undefined) user.phone = input.phone;

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
    user.status = status;

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
