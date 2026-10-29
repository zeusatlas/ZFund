import { userSettingsSchema, updateUserSettingsSchema } from '../../src/schemas/settings.schemas';
import { SettingsService } from '../../src/services/settings.service';

describe('SettingsService & Schemas', () => {
  const service = new SettingsService();

  describe('getPlatformFeeSettings', () => {
    it('should return transparent 14% commission and 86% net host proceeds', () => {
      const fees = service.getPlatformFeeSettings();
      expect(fees.commissionPercentage).toBe(14.0);
      expect(fees.hostNetPercentage).toBe(86.0);
      expect(fees.accountFee).toBe('0.00');
      expect(fees.disbursementFee).toBe('0.00');
      expect(fees.currency).toBe('GHS');
      expect(fees.masterShortcode).toBe('*920*969#');
    });
  });

  describe('userSettingsSchema validation', () => {
    it('should validate and apply default values for mobile money payout', () => {
      const parsed = userSettingsSchema.parse({});
      expect(parsed.preferredPayout).toBe('Mobile money');
      expect(parsed.defaultInstitution).toBe('MTN Mobile Money');
      expect(parsed.contributionAlerts).toBe(true);
      expect(parsed.withdrawalUpdates).toBe(true);
      expect(parsed.campaignDigest).toBe(false);
    });

    it('should parse valid bank transfer payout settings', () => {
      const input = {
        preferredPayout: 'Bank transfer' as const,
        defaultInstitution: 'GCB Bank PLC',
        defaultBranch: 'Accra Main',
        defaultRecipient: 'St. Jude Welfare Committee',
        defaultAccount: '1041010029381',
        contributionAlerts: false,
        withdrawalUpdates: true,
        campaignDigest: true,
      };

      const parsed = userSettingsSchema.parse(input);
      expect(parsed.preferredPayout).toBe('Bank transfer');
      expect(parsed.defaultInstitution).toBe('GCB Bank PLC');
      expect(parsed.defaultBranch).toBe('Accra Main');
      expect(parsed.defaultRecipient).toBe('St. Jude Welfare Committee');
      expect(parsed.defaultAccount).toBe('1041010029381');
      expect(parsed.contributionAlerts).toBe(false);
      expect(parsed.campaignDigest).toBe(true);
    });

    it('should validate partial update inputs via updateUserSettingsSchema', () => {
      const partial = updateUserSettingsSchema.parse({
        defaultInstitution: 'Ecobank Ghana Plc',
        defaultBranch: 'Ridge Branch',
      });

      expect(partial.defaultInstitution).toBe('Ecobank Ghana Plc');
      expect(partial.defaultBranch).toBe('Ridge Branch');
      expect(partial.preferredPayout).toBeUndefined();
    });
  });
});

