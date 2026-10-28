import { IsNull } from 'typeorm';
import { AppDataSource, initializeDatabase } from '../config/database';
import { logger } from '../config/logger';
import { PermissionCode, SystemRole } from '../common/types/auth';
import { env } from '../config/env';
import { normalizePhone } from '../common/utils/phone';
import { CryptoUtil } from '../common/utils/crypto';
import {
  Contribution,
  ContributionPurpose,
  ContributionStatus,
  Contributor,
  NotificationChannel,
  NotificationTemplate,
  PaymentAttempt,
  PaymentChannel,
  PaymentStatus,
  Permission,
  Project,
  ProjectCategory,
  ProjectMember,
  ProjectMemberRole,
  Organization,
  OrgVerificationStatus,
  PaymentMethodType,
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
  WithdrawalMethod,
  WithdrawalRequest,
  WithdrawalStatus,
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
  const existingGeneralFlow = await flowRepo.findOne({ where: { projectId: IsNull() } });
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

    // Enter Payment OTP Menu
    const enterOtpMenu = menuRepo.create({
      flowVersionId: savedVersion.id,
      menuKey: 'ENTER_PAYMENT_OTP',
      title: 'Enter Payment OTP',
      prompt: 'Enter the OTP/voucher code sent to your phone (or 0 to cancel):',
      menuType: UssdMenuType.INPUT,
      displayOrder: 3,
    });
    await menuRepo.save(enterOtpMenu);

    logger.info('Seeded General USSD Flow and Menus (*920*969#)');
  }

  // 8. Seed Demo Projects and Contributions if none exist
  const contributorRepo = AppDataSource.getRepository(Contributor);
  const contributionRepo = AppDataSource.getRepository(Contribution);
  const paymentAttemptRepo = AppDataSource.getRepository(PaymentAttempt);
  const memberRepo = AppDataSource.getRepository(ProjectMember);

  if ((await projectRepo.count()) === 0) {
    logger.info('Seeding initial demo projects and contributions...');
    const admin = await userRepo.findOne({ where: { email: adminEmail } });
    const commCat = await categoryRepo.findOne({ where: { slug: 'community-development' } });
    const eduCat = await categoryRepo.findOne({ where: { slug: 'schools-education' } });
    const genCat = await categoryRepo.findOne({ where: { slug: 'fundraising' } });

    const p1 = await projectRepo.save(
      projectRepo.create({
        name: 'Aburi community borehole',
        eventCode: '1001',
        description: 'A shared appeal to fund a borehole and improve access to clean water for households in the community.',
        welcomeMessage: 'Aburi, Eastern Region',
        currency: 'GHS',
        targetAmount: '50000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.APPROVED,
        acceptsContributions: true,
        categoryId: commCat?.id,
        createdAt: new Date('2026-10-12T10:00:00Z'),
      })
    );

    const p2 = await projectRepo.save(
      projectRepo.create({
        name: 'Books for the next generation',
        eventCode: '1002',
        description: 'Old students coming together to furnish a school library with books, shelves, and reading tables.',
        welcomeMessage: 'Cape Coast, Central Region',
        currency: 'GHS',
        targetAmount: '30000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.APPROVED,
        acceptsContributions: true,
        categoryId: eduCat?.id,
        createdAt: new Date('2026-10-05T09:00:00Z'),
      })
    );

    const p3 = await projectRepo.save(
      projectRepo.create({
        name: 'Market women’s welfare fund',
        eventCode: '1003',
        description: 'Support for members of our market association during medical emergencies and difficult times.',
        welcomeMessage: 'Kumasi, Ashanti Region',
        currency: 'GHS',
        targetAmount: '20000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.APPROVED,
        acceptsContributions: true,
        categoryId: genCat?.id,
        createdAt: new Date('2026-09-18T08:30:00Z'),
      })
    );

    const p4 = await projectRepo.save(
      projectRepo.create({
        name: 'School essentials appeal',
        eventCode: '1004',
        description: 'School bags, exercise books, and learning materials for children at the start of term.',
        welcomeMessage: 'Tamale, Northern Region',
        currency: 'GHS',
        targetAmount: '15000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.COMPLETED,
        acceptsContributions: false,
        categoryId: eduCat?.id,
        createdAt: new Date('2026-08-01T11:00:00Z'),
      })
    );

    const p5 = await projectRepo.save(
      projectRepo.create({
        name: 'Community food drive',
        eventCode: '1005',
        description: 'A neighbourhood food drive to prepare and distribute essential food packages.',
        welcomeMessage: 'Accra, Greater Accra Region',
        currency: 'GHS',
        targetAmount: '10000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.COMPLETED,
        acceptsContributions: false,
        categoryId: commCat?.id,
        createdAt: new Date('2026-07-10T12:00:00Z'),
      })
    );

    const p6 = await projectRepo.save(
      projectRepo.create({
        name: 'Youth skills workshop',
        eventCode: '1006',
        description: 'A practical skills workshop for young people, with materials and equipment covered by the campaign.',
        welcomeMessage: 'Ho, Volta Region',
        currency: 'GHS',
        targetAmount: '25000.00',
        minAmount: '1.00',
        maxAmount: '10000.00',
        status: ProjectStatus.DRAFT,
        acceptsContributions: false,
        categoryId: commCat?.id,
        createdAt: new Date('2026-06-20T14:00:00Z'),
      })
    );

    if (admin) {
      for (const p of [p1, p2, p3, p4, p5, p6]) {
        await memberRepo.save(
          memberRepo.create({
            projectId: p.id,
            userId: admin.id,
            role: ProjectMemberRole.OWNER,
          })
        );
      }
    }

    // Seed contributors
    const donorPhones = [
      { key: 'D-001', phone: '0243120345', name: 'Kwame Mensah' },
      { key: 'D-002', phone: '0204560891', name: 'Akua Mansa' },
      { key: 'D-003', phone: '0278910202', name: 'Kofi Annan' },
      { key: 'D-004', phone: '0551231120', name: 'Ama Serwaa' },
      { key: 'D-005', phone: '0507890456', name: 'Yaw Boateng' },
      { key: 'D-006', phone: '0543210712', name: 'Abena Osei' },
      { key: 'D-007', phone: '0266540880', name: 'Esi Dadzie' },
      { key: 'D-008', phone: '0249870901', name: 'Kojo Antwi' },
      { key: 'D-009', phone: '0201120144', name: 'Adwoa Safo' },
      { key: 'D-010', phone: '0273340420', name: 'Kwaku Duah' },
      { key: 'D-011', phone: '0509980600', name: 'Afia Pokua' },
    ];

    const donorMap = new Map<string, Contributor>();
    for (const d of donorPhones) {
      let donor = await contributorRepo.findOne({ where: { msisdn: d.phone } });
      if (!donor) {
        donor = await contributorRepo.save(
          contributorRepo.create({
            msisdn: d.phone,
            name: d.name,
          })
        );
      }
      donorMap.set(d.key, donor);
    }

    const demoContributions = [
      { ref: 'ZF-20261027-TX012', project: p1, donor: 'D-001', amount: '12500.00', status: ContributionStatus.CONFIRMED, date: '2026-10-27T14:32:00Z' },
      { ref: 'ZF-20261026-TX011', project: p2, donor: 'D-002', amount: '8400.00', status: ContributionStatus.CONFIRMED, date: '2026-10-26T09:18:00Z' },
      { ref: 'ZF-20261025-TX010', project: p1, donor: 'D-003', amount: '7500.00', status: ContributionStatus.CONFIRMED, date: '2026-10-25T16:05:00Z' },
      { ref: 'ZF-20261024-TX009', project: p3, donor: 'D-004', amount: '4250.00', status: ContributionStatus.CONFIRMED, date: '2026-10-24T11:42:00Z' },
      { ref: 'ZF-20261023-TX008', project: p1, donor: 'D-001', amount: '8475.00', status: ContributionStatus.CONFIRMED, date: '2026-10-23T08:26:00Z' },
      { ref: 'ZF-20261022-TX007', project: p2, donor: 'D-005', amount: '4000.00', status: ContributionStatus.CONFIRMED, date: '2026-10-22T17:10:00Z' },
      { ref: 'ZF-20261021-TX006', project: p3, donor: 'D-006', amount: '3500.00', status: ContributionStatus.CONFIRMED, date: '2026-10-21T13:54:00Z' },
      { ref: 'ZF-20261020-TX005', project: p1, donor: 'D-007', amount: '500.00', status: ContributionStatus.PENDING, date: '2026-10-20T10:23:00Z' },
      { ref: 'ZF-20260928-TX004', project: p4, donor: 'D-008', amount: '10000.00', status: ContributionStatus.CONFIRMED, date: '2026-09-28T15:37:00Z' },
      { ref: 'ZF-20260925-TX003', project: p4, donor: 'D-009', amount: '5000.00', status: ContributionStatus.CONFIRMED, date: '2026-09-25T12:08:00Z' },
      { ref: 'ZF-20260819-TX002', project: p5, donor: 'D-010', amount: '10000.00', status: ContributionStatus.CONFIRMED, date: '2026-08-19T09:46:00Z' },
      { ref: 'ZF-20261019-TX001', project: p3, donor: 'D-011', amount: '100.00', status: ContributionStatus.FAILED, date: '2026-10-19T18:15:00Z' },
    ];

    for (const c of demoContributions) {
      const donor = donorMap.get(c.donor)!;
      const savedContrib = await contributionRepo.save(
        contributionRepo.create({
          reference: c.ref,
          projectId: c.project.id,
          contributorId: donor.id,
          amount: c.amount,
          currency: 'GHS',
          status: c.status,
          createdAt: new Date(c.date),
        })
      );

      await paymentAttemptRepo.save(
        paymentAttemptRepo.create({
          reference: `PAY-${c.ref}`,
          contributionId: savedContrib.id,
          provider: 'PAYSTACK',
          channel: PaymentChannel.MOBILE_MONEY,
          msisdn: donor.msisdn,
          amount: c.amount,
          currency: 'GHS',
          status:
            c.status === ContributionStatus.CONFIRMED
              ? PaymentStatus.SUCCESSFUL
              : c.status === ContributionStatus.PENDING
                ? PaymentStatus.PENDING
                : PaymentStatus.FAILED,
          createdAt: new Date(c.date),
        })
      );
    }

    logger.info('Seeded demo projects and contributions');

    const withdrawalRepo = AppDataSource.getRepository(WithdrawalRequest);
    if (admin) {
      const demoWithdrawals = [
        {
          reference: 'ZF-WDR-20261026-0005',
          project: p3,
          amount: '2500.00',
          status: WithdrawalStatus.PENDING,
          method: WithdrawalMethod.MOBILE_MONEY,
          recipient: 'Akosua Mensah',
          institution: 'MTN Mobile Money',
          account: '0240000345',
          purpose: 'Medical support for an association member.',
          reviewNote: 'Awaiting administrator review.',
          date: '2026-10-26T10:00:00Z',
        },
        {
          reference: 'ZF-WDR-20261025-0004',
          project: p2,
          amount: '1000.00',
          status: WithdrawalStatus.PROCESSING,
          method: WithdrawalMethod.BANK_TRANSFER,
          recipient: 'School library committee',
          institution: 'GCB Bank',
          account: '1023456789',
          purpose: 'First order of books and reading materials.',
          reviewNote: 'Approved in this example. Payout confirmation is pending.',
          date: '2026-10-25T11:00:00Z',
        },
        {
          reference: 'ZF-WDR-20261024-0003',
          project: p1,
          amount: '500.00',
          status: WithdrawalStatus.REJECTED,
          method: WithdrawalMethod.MOBILE_MONEY,
          recipient: 'Community water committee',
          institution: 'Telecel Cash',
          account: '0200000202',
          purpose: 'Site inspection costs.',
          reviewNote:
            'Recipient details did not match the supporting documents. No funds were deducted.',
          date: '2026-10-24T09:00:00Z',
        },
        {
          reference: 'ZF-WDR-20260930-0002',
          project: p4,
          amount: '6000.00',
          status: WithdrawalStatus.DONE,
          method: WithdrawalMethod.BANK_TRANSFER,
          recipient: 'School essentials committee',
          institution: 'Ecobank Ghana',
          account: '144100234567',
          purpose: 'Exercise books and school bags.',
          reviewNote: 'Payout completed.',
          date: '2026-09-30T14:00:00Z',
        },
        {
          reference: 'ZF-WDR-20260820-0001',
          project: p5,
          amount: '5000.00',
          status: WithdrawalStatus.DONE,
          method: WithdrawalMethod.MOBILE_MONEY,
          recipient: 'Community food committee',
          institution: 'MTN Mobile Money',
          account: '0240000456',
          purpose: 'Food packages for the community drive.',
          reviewNote: 'Payout completed.',
          date: '2026-08-20T16:00:00Z',
        },
      ];

      for (const w of demoWithdrawals) {
        await withdrawalRepo.save(
          withdrawalRepo.create({
            reference: w.reference,
            hostId: admin.id,
            projectId: w.project.id,
            amount: w.amount,
            currency: 'GHS',
            method: w.method,
            recipientName: w.recipient,
            institution: w.institution,
            accountNumber: w.account,
            purpose: w.purpose,
            status: w.status,
            reviewNote: w.reviewNote,
            createdAt: new Date(w.date),
          })
        );
      }
      logger.info('Seeded demo withdrawal requests');
    }
  }

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
