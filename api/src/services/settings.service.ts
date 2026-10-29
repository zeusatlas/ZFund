import { AppDataSource } from '../config/database';
import { NotFoundError } from '../common/errors/app-error';
import { User } from '../database/entities/user.entity';
import { auditService } from './audit.service';
import { UserSettingsInput } from '../schemas/settings.schemas';

export class SettingsService {
  private get userRepo() {
    return AppDataSource.getRepository(User);
  }

  async getUserSettings(userId: string): Promise<UserSettingsInput> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const raw = (user.settings || {}) as Partial<UserSettingsInput>;
    const defaultRecipient =
      raw.defaultRecipient || `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const defaultAccount = raw.defaultAccount || user.phone || '';

    return {
      preferredPayout: raw.preferredPayout === 'Bank transfer' ? 'Bank transfer' : 'Mobile money',
      defaultInstitution: raw.defaultInstitution || 'MTN Mobile Money',
      defaultBranch: raw.defaultBranch || '',
      defaultRecipient,
      defaultAccount,
      contributionAlerts: raw.contributionAlerts !== false,
      withdrawalUpdates: raw.withdrawalUpdates !== false,
      campaignDigest: raw.campaignDigest === true,
    };
  }

  async updateUserSettings(
    userId: string,
    input: Partial<UserSettingsInput>,
    actorId?: string
  ): Promise<UserSettingsInput> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const currentSettings = await this.getUserSettings(userId);
    const updatedSettings: UserSettingsInput = {
      ...currentSettings,
      ...input,
    };

    user.settings = updatedSettings as unknown as Record<string, unknown>;
    await this.userRepo.save(user);

    await auditService.log({
      userId: actorId || userId,
      entityType: 'USER',
      entityId: user.id,
      action: 'UPDATE_SETTINGS',
      oldValues: { settings: currentSettings },
      newValues: { settings: updatedSettings },
    });

    return updatedSettings;
  }

  getPlatformFeeSettings() {
    return {
      commissionPercentage: 14.0,
      hostNetPercentage: 86.0,
      accountFee: '0.00',
      disbursementFee: '0.00',
      currency: 'GHS',
      masterShortcode: '*920*969#',
      description: '14% telecom and payment gateway processing fee on gross contributions.',
    };
  }
}

export const settingsService = new SettingsService();

