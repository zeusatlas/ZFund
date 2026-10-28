import { IsNull } from 'typeorm';
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
  Organization,
  OrgVerificationStatus,
  PaymentMethodType,
  Permission,
  Project,
  ProjectCategory,
  ProjectPaymentMethod,
  ProjectStatus,
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
  const orgRepo = AppDataSource.getRepository(Organization);
  const projectRepo = AppDataSource.getRepository(Project);
  const paymentMethodRepo = AppDataSource.getRepository(ProjectPaymentMethod);

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
  const adminEmail = 'admin@raisefundz.com';
  const adminPhone = normalizePhone('0245482029');
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await CryptoUtil.hashPassword('Admin@2026!');
    await userRepo.save(
      userRepo.create({
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Administrator',
        phone: adminPhone,
        role: SystemRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
      })
    );
    logger.info(`Seeded Super Admin user: ${adminEmail} (${adminPhone})`);
  } else {
    existingAdmin.phone = adminPhone;
    existingAdmin.status = UserStatus.ACTIVE;
    await userRepo.save(existingAdmin);
    logger.info(`Ensured Super Admin phone: ${adminEmail} (${adminPhone})`);
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
      messageTemplate: 'Payment of {currency} {amount} to {projectName} was successful. Ref: {reference}. Thank you for contributing through RaiseFunds.',
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
      messageTemplate: 'RaiseFunds Alert: New contribution of {currency} {amount} received for {projectName}.',
      approvedPlaceholders: ['currency', 'amount', 'projectName'],
    },
  ];

  for (const t of templates) {
    const existing = await templateRepo.findOne({ where: { templateKey: t.templateKey } });
    if (!existing) {
      await templateRepo.save(templateRepo.create(t));
    }
  }

  // 7. Seed or Update General USSD Flow (*920*969#)
  let generalFlow = await flowRepo.findOne({ where: { projectId: IsNull() } });
  if (!generalFlow) {
    generalFlow = await flowRepo.save(
      flowRepo.create({
        name: 'General RaiseFunds USSD Menu',
        description: 'Default USSD Flow for *920*969#',
        status: UssdFlowStatus.PUBLISHED,
      })
    );
  }

  let version = await versionRepo.findOne({
    where: { flowId: generalFlow.id, status: UssdFlowVersionStatus.PUBLISHED },
    relations: ['menus', 'menus.options'],
  });

  if (!version) {
    version = await versionRepo.save(
      versionRepo.create({
        flowId: generalFlow.id,
        versionNumber: 1,
        status: UssdFlowVersionStatus.PUBLISHED,
        publishedAt: new Date(),
        notes: 'Initial general menu',
      })
    );
    generalFlow.activeVersionId = version.id;
    await flowRepo.save(generalFlow);
  }

  // Ensure Welcome Menu matches new Raise-Fundz format
  let welcomeMenu = await menuRepo.findOne({
    where: { flowVersionId: version.id, menuKey: 'WELCOME' },
    relations: ['options'],
  });

  if (!welcomeMenu) {
    welcomeMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: version.id,
        menuKey: 'WELCOME',
        title: 'Welcome to Raise-Fundz',
        prompt: 'Welcome to your number one Fund Raising platform',
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
      })
    );
  } else {
    welcomeMenu.prompt = 'Welcome to your number one Fund Raising platform';
    welcomeMenu.title = 'Welcome to Raise-Fundz';
    await menuRepo.save(welcomeMenu);
    if (welcomeMenu.options && welcomeMenu.options.length > 0) {
      await optionRepo.remove(welcomeMenu.options);
    }
  }

  await optionRepo.save([
    optionRepo.create({
      menuId: welcomeMenu.id,
      displayOrder: 1,
      optionKey: '1',
      label: 'Support Project',
      optionType: UssdOptionType.ACTION,
      actionReference: 'SUPPORT_PROJECT',
    }),
    optionRepo.create({
      menuId: welcomeMenu.id,
      displayOrder: 2,
      optionKey: '2',
      label: 'Know more about Raise-Fundz',
      optionType: UssdOptionType.ACTION,
      actionReference: 'KNOW_MORE',
    }),
    optionRepo.create({
      menuId: welcomeMenu.id,
      displayOrder: 3,
      optionKey: '3',
      label: 'Register Today',
      optionType: UssdOptionType.ACTION,
      actionReference: 'REGISTER_TODAY',
    }),
    optionRepo.create({
      menuId: welcomeMenu.id,
      displayOrder: 4,
      optionKey: '4',
      label: 'Exit',
      optionType: UssdOptionType.ACTION,
      actionReference: 'EXIT',
    }),
  ]);

  // Enter Payment OTP Menu (global fallback)
  let enterOtpMenu = await menuRepo.findOne({
    where: { flowVersionId: version.id, menuKey: 'ENTER_PAYMENT_OTP' },
  });
  if (!enterOtpMenu) {
    enterOtpMenu = menuRepo.create({
      flowVersionId: version.id,
      menuKey: 'ENTER_PAYMENT_OTP',
      title: 'Enter Payment OTP',
      prompt: 'Enter the OTP/voucher code sent to your phone (or 0 to cancel):',
      menuType: UssdMenuType.INPUT,
      displayOrder: 3,
    });
    await menuRepo.save(enterOtpMenu);
  }

  logger.info('Seeded General USSD Flow and Menus (*920*969#)');

  // 8. Seed Demo Church Project (*920*969*1001#)
  const existingProject1001 = await projectRepo.findOne({ where: { eventCode: '1001' } });
  if (!existingProject1001) {
    let org = await orgRepo.findOne({ where: { slug: 'holy-trinity-parish' } });
    if (!org) {
      org = await orgRepo.save(
        orgRepo.create({
          name: 'Holy Trinity Parish',
          slug: 'holy-trinity-parish',
          verificationStatus: OrgVerificationStatus.VERIFIED,
        })
      );
    }

    const admin = await userRepo.findOne({ where: { email: adminEmail } });
    const churchCategory = await categoryRepo.findOne({ where: { slug: 'church-religious' } });

    const project1001 = await projectRepo.save(
      projectRepo.create({
        name: 'Holy Trinity Church Project',
        description: 'Contributions for Holy Trinity Cathedral harvest and community outreach.',
        organizationId: org.id,
        ownerId: admin ? admin.id : undefined,
        categoryId: churchCategory ? churchCategory.id : undefined,
        eventCode: '1001',
        currency: 'GHS',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    await paymentMethodRepo.save(
      paymentMethodRepo.create({
        projectId: project1001.id,
        method: PaymentMethodType.MOBILE_MONEY,
        provider: 'PAYSTACK',
        isEnabled: true,
      })
    );

    const projectFlow = await flowRepo.save(
      flowRepo.create({
        name: 'Holy Trinity Church USSD Flow',
        description: 'Direct USSD menu for event code 1001',
        projectId: project1001.id,
        status: UssdFlowStatus.PUBLISHED,
      })
    );

    const projectVersion = await versionRepo.save(
      versionRepo.create({
        flowId: projectFlow.id,
        versionNumber: 1,
        status: UssdFlowVersionStatus.PUBLISHED,
        publishedAt: new Date(),
      })
    );

    projectFlow.activeVersionId = projectVersion.id;
    await flowRepo.save(projectFlow);

    // Welcome Menu
    const projectWelcome = await menuRepo.save(
      menuRepo.create({
        flowVersionId: projectVersion.id,
        menuKey: 'WELCOME',
        title: 'Church Welcome',
        prompt: 'Welcome to Holy Trinity Cathedral.\nSelect:',
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: projectWelcome.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Offering',
        optionType: UssdOptionType.ACTION,
        actionReference: 'SELECT_PURPOSE',
        targetMenuKey: 'AMOUNT_INPUT',
      }),
      optionRepo.create({
        menuId: projectWelcome.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Tithe',
        optionType: UssdOptionType.ACTION,
        actionReference: 'SELECT_PURPOSE',
        targetMenuKey: 'AMOUNT_INPUT',
      }),
      optionRepo.create({
        menuId: projectWelcome.id,
        displayOrder: 3,
        optionKey: '3',
        label: 'Exit',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);

    // Amount input menu
    await menuRepo.save(
      menuRepo.create({
        flowVersionId: projectVersion.id,
        menuKey: 'AMOUNT_INPUT',
        title: 'Enter Amount',
        prompt: 'Enter Amount in GHS:',
        menuType: UssdMenuType.INPUT,
        displayOrder: 2,
        isActive: true,
      })
    );

    // Confirmation menu
    const projectConfirm = await menuRepo.save(
      menuRepo.create({
        flowVersionId: projectVersion.id,
        menuKey: 'CONFIRM_PAYMENT',
        title: 'Confirm Contribution',
        prompt: 'Contribute GHS {amount} to {projectName}?',
        menuType: UssdMenuType.SELECT,
        displayOrder: 3,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: projectConfirm.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Confirm',
        optionType: UssdOptionType.ACTION,
        actionReference: 'INITIATE_PAYMENT',
      }),
      optionRepo.create({
        menuId: projectConfirm.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Cancel',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);

    // Enter Payment OTP Menu
    await menuRepo.save(
      menuRepo.create({
        flowVersionId: projectVersion.id,
        menuKey: 'ENTER_PAYMENT_OTP',
        title: 'Enter Payment OTP',
        prompt: 'Enter the OTP/voucher code sent to your phone (or 0 to cancel):',
        menuType: UssdMenuType.INPUT,
        displayOrder: 4,
        isActive: true,
      })
    );

    logger.info('Seeded Demo Church Project (*920*969*1001#)');
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
