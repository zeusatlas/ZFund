import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { cache } from '../../src/config/redis';
import { SystemRole } from '../../src/common/types/auth';
import { Organization, OrgVerificationStatus } from '../../src/database/entities/organization.entity';
import { Project, ProjectStatus } from '../../src/database/entities/project.entity';
import { UssdFlowVersion, UssdFlowVersionStatus } from '../../src/database/entities/ussd-flow-version.entity';
import { UssdFlow, UssdFlowStatus } from '../../src/database/entities/ussd-flow.entity';
import { UssdMenuOption, UssdOptionType } from '../../src/database/entities/ussd-menu-option.entity';
import { UssdMenu, UssdMenuType } from '../../src/database/entities/ussd-menu.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Database-Driven USSD Engine (Dynamic menus, state transitions & NALO runtime)', () => {
  let app: any;
  let testProject: Project;
  let testFlow: UssdFlow;
  let testVersion: UssdFlowVersion;
  let welcomeMenu: UssdMenu;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const projectRepo = AppDataSource.getRepository(Project);
    const flowRepo = AppDataSource.getRepository(UssdFlow);
    const versionRepo = AppDataSource.getRepository(UssdFlowVersion);
    const menuRepo = AppDataSource.getRepository(UssdMenu);
    const optionRepo = AppDataSource.getRepository(UssdMenuOption);

    // 1. Create User and Organization
    const user = await userRepo.save(
      userRepo.create({
        email: 'reverend.kwabena@church.org',
        passwordHash: 'argon_hash',
        firstName: 'Kwabena',
        lastName: 'Mensah',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    const org = await orgRepo.save(
      orgRepo.create({
        name: 'Holy Trinity Parish',
        slug: 'holy-trinity-parish',
        verificationStatus: OrgVerificationStatus.VERIFIED,
      })
    );

    // 2. Create Project with Event Code 1001
    testProject = await projectRepo.save(
      projectRepo.create({
        name: 'Holy Trinity Church Project',
        organizationId: org.id,
        ownerId: user.id,
        eventCode: '1001',
        currency: 'GHS',
        minAmount: '1.00',
        maxAmount: '5000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    // 3. Create USSD Flow in PostgreSQL
    testFlow = await flowRepo.save(
      flowRepo.create({
        name: 'Holy Trinity USSD Flow',
        projectId: testProject.id,
        status: UssdFlowStatus.PUBLISHED,
      })
    );

    testVersion = await versionRepo.save(
      versionRepo.create({
        flowId: testFlow.id,
        versionNumber: 1,
        status: UssdFlowVersionStatus.PUBLISHED,
        publishedAt: new Date(),
      })
    );

    testFlow.activeVersionId = testVersion.id;
    await flowRepo.save(testFlow);

    // 4. Create Menus and Options in PostgreSQL
    welcomeMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
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
        menuId: welcomeMenu.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Offering',
        optionType: UssdOptionType.ACTION,
        actionReference: 'SELECT_PURPOSE',
        targetMenuKey: 'AMOUNT_INPUT',
      }),
      optionRepo.create({
        menuId: welcomeMenu.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Tithe',
        optionType: UssdOptionType.ACTION,
        actionReference: 'SELECT_PURPOSE',
        targetMenuKey: 'AMOUNT_INPUT',
      }),
      optionRepo.create({
        menuId: welcomeMenu.id,
        displayOrder: 3,
        optionKey: '3',
        label: 'Exit',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);

    // Amount input menu
    const amountMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
        menuKey: 'AMOUNT_INPUT',
        title: 'Enter Amount',
        prompt: 'Enter Amount in {currency}:',
        menuType: UssdMenuType.INPUT,
        displayOrder: 2,
        isActive: true,
      })
    );

    // Confirmation menu
    const confirmMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
        menuKey: 'CONFIRM_PAYMENT',
        title: 'Confirm Contribution',
        prompt: 'Contribute {currency} {amount} to {projectName}?\n1. Confirm\n2. Cancel',
        menuType: UssdMenuType.SELECT,
        displayOrder: 3,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Confirm',
        optionType: UssdOptionType.ACTION,
        actionReference: 'INITIATE_PAYMENT',
      }),
      optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Cancel',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should route direct event code (*920*969*1001#) and display the initial menu configured in database', async () => {
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233241112233',
        USERDATA: '*920*969*1001#',
        MSGTYPE: false, // initial request
        NETWORK: 'MTN',
        SESSIONID: 'session-turn-1',
      });

    expect(res.status).toBe(200);
    expect(res.body.USERID).toBe('NALOTest');
    expect(res.body.MSISDN).toBe('233241112233');
    expect(res.body.MSGTYPE).toBe(true);
    expect(res.body.MSG).toContain('Welcome to Holy Trinity Cathedral.');
    expect(res.body.MSG).toContain('1. Offering');
    expect(res.body.MSG).toContain('2. Tithe');
    expect(res.body.MSG).toContain('3. Exit');
  });

  it('CRITICAL TEST: Changing the menu in the database MUST change the menu displayed to contributor without TypeScript code changes', async () => {
    // 1. Update the menu prompt in PostgreSQL directly
    const menuRepo = AppDataSource.getRepository(UssdMenu);
    welcomeMenu.prompt = 'Welcome to Holy Trinity 2026 Harvest Celebration!\nSelect:';
    await menuRepo.save(welcomeMenu);

    // Invalidate Redis/memory flow cache to simulate immediate DB reload
    await cache.del(`ussd:flow:project:${testProject.id}`);

    // 2. Next contributor dials the same code
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233249998877',
        USERDATA: '*920*969*1001#',
        MSGTYPE: false,
        NETWORK: 'MTN',
        SESSIONID: 'session-turn-2',
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    // Verified: The new prompt from the database is rendered!
    expect(res.body.MSG).toContain('Welcome to Holy Trinity 2026 Harvest Celebration!');
    expect(res.body.MSG).toContain('1. Offering');
  });

  it('should navigate multi-turn flow: Select Purpose -> Enter Amount -> Confirm -> Initiate Payment', async () => {
    const sessionId = 'session-full-flow-1001';

    // Turn 1: Initial dial
    const turn1 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '*920*969*1001#',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    expect(turn1.status).toBe(200);
    expect(turn1.body.MSGTYPE).toBe(true);

    // Turn 2: Select '1' (Offering)
    const turn2 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '1',
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    expect(turn2.status).toBe(200);
    expect(turn2.body.MSGTYPE).toBe(true);
    expect(turn2.body.MSG).toContain('Enter Amount in GHS:');

    // Turn 3: Enter Amount '50.00'
    const turn3 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '50.00',
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    expect(turn3.status).toBe(200);
    expect(turn3.body.MSGTYPE).toBe(true);
    expect(turn3.body.MSG).toContain('Contribute GHS 50.00 to Holy Trinity Church Project?');

    // Turn 4: Select '1' (Confirm)
    const turn4 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '1',
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    expect(turn4.status).toBe(200);
    // Final prompt terminates session (MSGTYPE = false)
    expect(turn4.body.MSGTYPE).toBe(false);
    expect(turn4.body.MSG).toContain('Payment of GHS 50.00 initiated');
  });

  it('should handle invalid menu input gracefully without crashing session', async () => {
    const sessionId = 'session-invalid-input-1';

    // Start session
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '*920*969*1001#',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    // Send invalid option '9'
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '9',
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    expect(res.body.MSG).toContain('Invalid choice.');
  });
});
