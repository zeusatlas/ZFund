import { AppDataSource, initializeDatabase } from '../config/database';
import { logger } from '../config/logger';
import { PermissionCode, SystemRole } from '../common/types/auth';
import { env } from '../config/env';
import { normalizePhone } from '../common/utils/phone';
import { CryptoUtil } from '../common/utils/crypto';
import {
  ContributionPurpose,
  NotificationChannel,
  NotificationTemplate,
  Permission,
  ProjectCategory,
  Role,
  RolePermission,
  User,
  UserStatus,
  UssdFlow,
  UssdFlowStatus,
  UssdFlowVersion,
  UssdFlowVersionStatus,
  UssdMenu,
  UssdMenuOption,
  UssdMenuType,
  UssdOptionType,
} from './entities';

export async function runSeeds(): Promise<void> {
  logger.info('Starting database seeding...');
  await initializeDatabase();

  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);
  const rolePermRepo = AppDataSource.getRepository(RolePermission);
  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(ProjectCategory);
  const purposeRepo = AppDataSource.getRepository(ContributionPurpose);
  const templateRepo = AppDataSource.getRepository(NotificationTemplate);
  const flowRepo = AppDataSource.getRepository(UssdFlow);
  const versionRepo = AppDataSource.getRepository(UssdFlowVersion);
  const menuRepo = AppDataSource.getRepository(UssdMenu);
  const optionRepo = AppDataSource.getRepository(UssdMenuOption);

  // 1. Seed Roles
  const roles = Object.values(SystemRole);
  for (const roleName of roles) {
    const existing = await roleRepo.findOne({ where: { name: roleName } });
    if (!existing) {
      await roleRepo.save(
        roleRepo.create({
          name: roleName,
          description: `System role for ${roleName}`,
          isSystem: true,
        })
      );
    }
  }

  // 2. Seed Permissions
  const permissions = Object.values(PermissionCode);
  for (const permCode of permissions) {
    const existing = await permRepo.findOne({ where: { code: permCode } });
    if (!existing) {
      await permRepo.save(
        permRepo.create({
          code: permCode,
          description: `Permission for ${permCode}`,
          module: permCode.split('_')[0],
        })
      );
    }
  }

  // 3. Seed Super Admin Account
  const adminEmail = 'admin@zfund.org';
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await CryptoUtil.hashPassword('SuperAdminZFund2026!');
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        phone: env.SEED_ADMIN_PHONE ? normalizePhone(env.SEED_ADMIN_PHONE) : undefined,
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      })
    );
    logger.info(`Seeded Super Admin user: ${adminEmail}`);
  } else if (!existingAdmin.phone && env.SEED_ADMIN_PHONE) {
    existingAdmin.phone = normalizePhone(env.SEED_ADMIN_PHONE);
    await userRepo.save(existingAdmin);
    logger.info(`Set phone for Super Admin user: ${adminEmail}`);
  }

  // 4. Seed Project Categories
  const categories = [
    { name: 'Churches & Religious Groups', slug: 'church-religious', description: 'Tithes, offerings, building funds' },
    { name: 'Schools & Education', slug: 'schools-education', description: 'School fees, speech days, development projects' },
    { name: 'Alumni Associations', slug: 'alumni-associations', description: 'Alumni dues, year group projects, reunions' },
    { name: 'Events (Weddings & Funerals)', slug: 'events', description: 'Wedding gifts, funeral contributions, ceremonies' },
    { name: 'Community Development', slug: 'community-development', description: 'Town projects, sanitation, public facilities' },
    { name: 'General Fundraising', slug: 'fundraising', description: 'Medical appeals, non-profit campaigns, causes' },
  ];

  for (const cat of categories) {
    const existing = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!existing) {
      await categoryRepo.save(categoryRepo.create(cat));
    }
  }

  // 5. Seed Contribution Purposes
  const purposes = [
    { name: 'Offering', code: 'OFFERING', description: 'General church offering' },
    { name: 'Tithe', code: 'TITHE', description: 'Religious tithe' },
    { name: 'Building Project', code: 'BUILDING_FUND', description: 'Building & infrastructure' },
    { name: 'Donation', code: 'DONATION', description: 'General voluntary donation' },
    { name: 'Association Dues', code: 'ASSOCIATION_DUES', description: 'Periodic membership dues' },
    { name: 'Welfare Fund', code: 'WELFARE', description: 'Member welfare and assistance' },
  ];

  for (const p of purposes) {
    const existing = await purposeRepo.findOne({ where: { code: p.code } });
    if (!existing) {
      await purposeRepo.save(purposeRepo.create(p));
    }
  }

  // 6. Seed Notification Templates
  const templates = [
    {
      templateKey: 'CONTRIBUTION_CONFIRMED_CONTRIBUTOR',
      channel: NotificationChannel.SMS,
      eventType: 'PAYMENT_SUCCESS',
      title: 'Contribution Confirmation',
      messageTemplate: 'Payment of {currency} {amount} to {projectName} was successful. Ref: {reference}. Thank you for contributing through ZFund.',
      approvedPlaceholders: ['currency', 'amount', 'projectName', 'reference'],
    },
    {
      templateKey: 'REFUND_COMPLETED_CONTRIBUTOR',
      channel: NotificationChannel.SMS,
      eventType: 'REFUND_COMPLETED',
      title: 'Refund Processed',
      messageTemplate: 'Your refund of {currency} {amount} has been processed successfully. Ref: {reference}.',
      approvedPlaceholders: ['currency', 'amount', 'reference'],
    },
    {
      templateKey: 'NEW_CONTRIBUTION_OWNER',
      channel: NotificationChannel.SMS,
      eventType: 'PAYMENT_SUCCESS',
      title: 'New Contribution Alert',
      messageTemplate: 'ZFund Alert: New contribution of {currency} {amount} received for {projectName}.',
      approvedPlaceholders: ['currency', 'amount', 'projectName'],
    },
  ];

  for (const t of templates) {
    const existing = await templateRepo.findOne({ where: { templateKey: t.templateKey } });
    if (!existing) {
      await templateRepo.save(templateRepo.create(t));
    }
  }

  // 7. Seed General USSD Flow (*920*969#)
  const existingGeneralFlow = await flowRepo.findOne({ where: { projectId: undefined } });
  if (!existingGeneralFlow) {
    const flow = flowRepo.create({
      name: 'General ZFund USSD Menu',
      description: 'Default USSD Flow for *920*969#',
      status: UssdFlowStatus.PUBLISHED,
    });
    const savedFlow = await flowRepo.save(flow);

    const version = versionRepo.create({
      flowId: savedFlow.id,
      versionNumber: 1,
      status: UssdFlowVersionStatus.PUBLISHED,
      publishedAt: new Date(),
      notes: 'Initial general menu',
    });
    const savedVersion = await versionRepo.save(version);

    savedFlow.activeVersionId = savedVersion.id;
    await flowRepo.save(savedFlow);

    // Welcome Menu
    const welcomeMenu = menuRepo.create({
      flowVersionId: savedVersion.id,
      menuKey: 'WELCOME',
      title: 'Welcome to ZFund',
      prompt: 'Welcome to ZFund.\nSelect option:',
      menuType: UssdMenuType.SELECT,
      displayOrder: 1,
    });
    const savedWelcome = await menuRepo.save(welcomeMenu);

    await optionRepo.save([
      optionRepo.create({
        menuId: savedWelcome.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Enter Project Code',
        optionType: UssdOptionType.NAVIGATION,
        targetMenuKey: 'ENTER_CODE',
      }),
      optionRepo.create({
        menuId: savedWelcome.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'About ZFund',
        optionType: UssdOptionType.ACTION,
        actionReference: 'VIEW_PROJECT_INFO',
      }),
      optionRepo.create({
        menuId: savedWelcome.id,
        displayOrder: 3,
        optionKey: '3',
        label: 'Exit',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);

    // Enter Code Menu
    const enterCodeMenu = menuRepo.create({
      flowVersionId: savedVersion.id,
      menuKey: 'ENTER_CODE',
      title: 'Enter Project Code',
      prompt: 'Enter project code (e.g. 1001):',
      menuType: UssdMenuType.INPUT,
      displayOrder: 2,
    });
    await menuRepo.save(enterCodeMenu);

    logger.info('Seeded General USSD Flow and Menus (*920*969#)');
  }

  logger.info('Database seeding completed successfully.');
}

if (require.main === module) {
  runSeeds()
    .then(() => {
      logger.info('Seeding finished.');
      process.exit(0);
    })
    .catch((err) => {
      logger.error({ err }, 'Seeding failed');
      process.exit(1);
    });
}
