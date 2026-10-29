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
import { CryptoUtil } from '../../src/common/utils/crypto';
import { paymentService } from '../../src/services/payment.service';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Database-Driven USSD Engine (Dynamic menus, state transitions & NALO runtime)', () => {
  let app: any;
  let testProject: Project;
  let testFlow: UssdFlow;
  let testVersion: UssdFlowVersion;
  let welcomeMenu: UssdMenu;
  let authToken: string;

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

    authToken = CryptoUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

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

    // 5. Seed General USSD Flow (*920*969#)
    const generalFlow = await flowRepo.save(
      flowRepo.create({
        name: 'General RaiseFunds USSD Menu',
        status: UssdFlowStatus.PUBLISHED,
      })
    );

    const generalVersion = await versionRepo.save(
      versionRepo.create({
        flowId: generalFlow.id,
        versionNumber: 1,
        status: UssdFlowVersionStatus.PUBLISHED,
        publishedAt: new Date(),
      })
    );

    generalFlow.activeVersionId = generalVersion.id;
    await flowRepo.save(generalFlow);

    const generalWelcome = await menuRepo.save(
      menuRepo.create({
        flowVersionId: generalVersion.id,
        menuKey: 'WELCOME',
        title: 'Welcome to Raise-Fundz',
        prompt: 'Welcome to your number one Fund Raising platform',
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 1,
        optionKey: '1',
        label: 'Support Project',
        optionType: UssdOptionType.ACTION,
        actionReference: 'SUPPORT_PROJECT',
      }),
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 2,
        optionKey: '2',
        label: 'Know more about Raise-Fundz',
        optionType: UssdOptionType.ACTION,
        actionReference: 'KNOW_MORE',
      }),
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 3,
        optionKey: '3',
        label: 'Register Today',
        optionType: UssdOptionType.ACTION,
        actionReference: 'REGISTER_TODAY',
      }),
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 4,
        optionKey: '4',
        label: 'Exit',
        optionType: UssdOptionType.ACTION,
        actionReference: 'EXIT',
      }),
    ]);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('should route general dial code (*920*969#) without event code and display main platform menu', async () => {
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240001122',
        USERDATA: '*920*969#',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: 'session-general-1',
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    expect(res.body.MSG).toContain('Welcome to your number one Fund Raising platform');
    expect(res.body.MSG).toContain('1. Support Project');
    expect(res.body.MSG).toContain('2. Know more about Raise-Fundz');
    expect(res.body.MSG).toContain('3. Register Today');
    expect(res.body.MSG).toContain('4. Exit');
  });

  it('Option 2: should display "Know more about Raise-Fundz" and website URL then end session', async () => {
    const sessionId = 'session-know-more-1';
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240002233',
        USERDATA: '*920*969#',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });

    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240002233',
        USERDATA: '2',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(false); // Session terminated
    expect(res.body.MSG).toContain('Raise-Fundz');
    expect(res.body.MSG).toContain('www.raisefundz.com');
  });

  it('Option 3: should display "Register Today" with business team contact info and end session', async () => {
    const sessionId = 'session-register-today-1';
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240003344',
        USERDATA: '*920*969#',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });

    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240003344',
        USERDATA: '3',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(false);
    expect(res.body.MSG).toContain('0203430792');
    expect(res.body.MSG).toContain('0303981602');
    expect(res.body.MSG).toContain('support@zeusatlasltd.com');
  });

  it('Option 1: should list active hosts, then campaigns, then transition into campaign custom flow', async () => {
    const sessionId = 'session-support-project-flow-1';

    // Turn 1: Dial *920*969#
    const turn1 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240004455',
        USERDATA: '*920*969#',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });
    expect(turn1.body.MSG).toContain('1. Support Project');

    // Turn 2: Select 1 (Support Project) -> Lists active hosts
    const turn2 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240004455',
        USERDATA: '1',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });
    expect(turn2.body.MSGTYPE).toBe(true);
    expect(turn2.body.MSG).toContain('Select Host:');
    expect(turn2.body.MSG).toContain('Holy Trinity Parish');

    // Turn 3: Select 1 (Holy Trinity Parish) -> Lists campaigns for this host
    const turn3 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240004455',
        USERDATA: '1',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });
    expect(turn3.body.MSGTYPE).toBe(true);
    expect(turn3.body.MSG).toContain('Select Campaign:');
    expect(turn3.body.MSG).toContain('Holy Trinity Church Project');

    // Turn 4: Select 1 (Holy Trinity Church Project) -> JUMPS DIRECTLY into campaign custom flow!
    const turn4 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240004455',
        USERDATA: '1',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });
    expect(turn4.body.MSGTYPE).toBe(true);
    // Custom campaign menu is rendered!
    expect(turn4.body.MSG).toContain('Holy Trinity');
    expect(turn4.body.MSG).toContain('1. Offering');
    expect(turn4.body.MSG).toContain('2. Tithe');
    expect(turn4.body.MSG).toContain('3. Exit');

    // Turn 5: Follow campaign custom flow -> Select 1 (Offering)
    const turn5 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233240004455',
        USERDATA: '1',
        MSGTYPE: true,
        NETWORK: 'MTN',
        SESSIONID: sessionId,
      });
    expect(turn5.body.MSGTYPE).toBe(true);
    expect(turn5.body.MSG).toContain('Enter Amount');
  });

  it('should route direct event code (*920*969*1001#) and display the initial menu configured in database', async () => {
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233241112233',
        USERDATA: '*920*969*1001#',
        MSGTYPE: true, // initial request in NALO contract
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
        MSGTYPE: true,
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
        MSGTYPE: true,
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
        MSGTYPE: false,
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
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    expect(turn3.status).toBe(200);
    expect(turn3.body.MSGTYPE).toBe(true);
    expect(turn3.body.MSG).toMatch(/Contribute GHS 50\.00 to (Offering|Holy Trinity Church Project)\\?/);

    // Turn 4: Select '1' (Confirm)
    const turn4 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '1',
        MSGTYPE: false,
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
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    // Send invalid option '9'
    const res = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233245556677',
        USERDATA: '9',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    expect(res.body.MSG).toContain('Invalid choice.');
  });

  it('should handle Paystack Mobile Money OTP challenge during USSD session', async () => {
    // Mock Paystack to require OTP for this test
    const chargeSpy = jest.spyOn(paymentService.currentProvider as any, 'chargeMobileMoney').mockResolvedValueOnce({
      reference: 'ZF-PAY-TEST-OTP-1',
      status: 'send_otp',
      requiresOtp: true,
      message: 'Please enter the OTP authorization code sent to your phone via SMS:',
      displayText: 'Please enter the OTP authorization code sent to your phone via SMS:',
    });

    const submitOtpSpy = jest.spyOn(paymentService.currentProvider as any, 'submitOtp').mockResolvedValueOnce({
      reference: 'ZF-PAY-TEST-OTP-1',
      status: 'success',
      message: 'Payment confirmed successfully!',
      displayText: 'Payment verified successfully! Thank you for your contribution.',
    });

    const sessionId = 'session-otp-flow-1001';

    // Turn 1: Initial dial
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233246667788',
        USERDATA: '*920*969*1001#',
        MSGTYPE: true,
        SESSIONID: sessionId,
      });

    // Turn 2: Select '1' (Offering)
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233246667788',
        USERDATA: '1',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    // Turn 3: Enter Amount '25.00'
    await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233246667788',
        USERDATA: '25.00',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    // Turn 4: Select '1' (Confirm) -> Paystack returns send_otp
    const turn4 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233246667788',
        USERDATA: '1',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    expect(turn4.status).toBe(200);
    // CRITICAL: Session does NOT terminate when OTP is required!
    expect(turn4.body.MSGTYPE).toBe(true);
    expect(turn4.body.MSG).toContain('Please enter the OTP authorization code');

    // Turn 5: Contributor enters OTP '123456'
    const turn5 = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233246667788',
        USERDATA: '123456',
        MSGTYPE: false,
        SESSIONID: sessionId,
      });

    expect(turn5.status).toBe(200);
    // After OTP is verified, session terminates cleanly
    expect(turn5.body.MSGTYPE).toBe(false);
    expect(turn5.body.MSG).toContain('Payment verified successfully!');

    expect(chargeSpy).toHaveBeenCalled();
    expect(submitOtpSpy).toHaveBeenCalled();

    chargeSpy.mockRestore();
    submitOtpSpy.mockRestore();
  });

  it('should allow contributor to cancel payment at OTP prompt with 0', async () => {
    jest.spyOn(paymentService.currentProvider as any, 'chargeMobileMoney').mockResolvedValueOnce({
      reference: 'ZF-PAY-TEST-CANCEL-1',
      status: 'send_otp',
      requiresOtp: true,
      message: 'Please enter OTP (or 0 to cancel):',
      displayText: 'Please enter OTP (or 0 to cancel):',
    });

    const sessionId = 'session-cancel-otp-1';

    // Start session and reach confirm
    await request(app).post('/api/v1/ussd/nalo').send({
      USERID: 'NALOTest',
      MSISDN: '233248889900',
      USERDATA: '*920*969*1001#',
      MSGTYPE: true,
      SESSIONID: sessionId,
    });
    await request(app).post('/api/v1/ussd/nalo').send({
      USERID: 'NALOTest',
      MSISDN: '233248889900',
      USERDATA: '1',
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    await request(app).post('/api/v1/ussd/nalo').send({
      USERID: 'NALOTest',
      MSISDN: '233248889900',
      USERDATA: '30.00',
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    // Confirm
    const turn4 = await request(app).post('/api/v1/ussd/nalo').send({
      USERID: 'NALOTest',
      MSISDN: '233248889900',
      USERDATA: '1',
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    expect(turn4.body.MSGTYPE).toBe(true);

    // Contributor types 0 to cancel
    const turn5 = await request(app).post('/api/v1/ussd/nalo').send({
      USERID: 'NALOTest',
      MSISDN: '233248889900',
      USERDATA: '0',
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn5.status).toBe(200);
    expect(turn5.body.MSGTYPE).toBe(false);
    expect(turn5.body.MSG).toContain('Payment cancelled.');
  });

  it('should 1-click initialize and publish a dynamic USSD flow for a new campaign', async () => {
    // 1. Create a brand new project with event code 2002
    const projectRepo = AppDataSource.getRepository(Project);
    const newProject = await projectRepo.save(
      projectRepo.create({
        name: 'St. Peter Youth Camp',
        organizationId: testProject.organizationId,
        ownerId: testProject.ownerId,
        eventCode: '2002',
        currency: 'GHS',
        minAmount: '5.00',
        maxAmount: '5000.00',
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    // 2. Call USSD flow 1-click initialize endpoint
    const initRes = await request(app)
      .post(`/api/v1/ussd/flows/projects/${newProject.id}/initialize`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        welcomePrompt: 'Welcome to St. Peter Youth Camp Appeal.\nSelect:',
        purposes: [
          { label: 'Camp Registration' },
          { label: 'Sponsor a Youth' },
        ],
      });

    expect(initRes.status).toBe(201);
    expect(initRes.body.success).toBe(true);
    expect(initRes.body.data.status).toBe(UssdFlowStatus.PUBLISHED);

    // 3. Dial the new campaign shortcode (*920*969*2002#) on USSD runtime
    const dialRes = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233249001122',
        USERDATA: '*920*969*2002#',
        MSGTYPE: true,
      });

    expect(dialRes.status).toBe(200);
    expect(dialRes.body.MSGTYPE).toBe(true);
    expect(dialRes.body.MSG).toContain('Welcome to St. Peter Youth Camp Appeal.');
    expect(dialRes.body.MSG).toContain('1. Camp Registration');
    expect(dialRes.body.MSG).toContain('2. Sponsor a Youth');
    expect(dialRes.body.MSG).toContain('3. Exit');
  });

  it('should dynamically update a menu prompt via PUT /api/v1/ussd/flows/menus/:menuId without server restart', async () => {
    // 1. Update the welcome menu prompt via the API
    const updateRes = await request(app)
      .put(`/api/v1/ussd/flows/menus/${welcomeMenu.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'Welcome to Holy Trinity 2026 Golden Jubilee!\nSelect:',
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.data.prompt).toBe('Welcome to Holy Trinity 2026 Golden Jubilee!\nSelect:');

    // Invalidate Redis cache to simulate live reload
    await cache.del(`ussd:flow:project:${testProject.id}`);

    // 2. Next contributor dials *920*969*1001# immediately sees updated prompt!
    const dialRes = await request(app)
      .post('/api/v1/ussd/nalo')
      .send({
        USERID: 'NALOTest',
        MSISDN: '233243334455',
        USERDATA: '*920*969*1001#',
        MSGTYPE: true,
      });

    expect(dialRes.status).toBe(200);
    expect(dialRes.body.MSG).toContain('Welcome to Holy Trinity 2026 Golden Jubilee!');
  });
});
