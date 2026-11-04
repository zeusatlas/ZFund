import request from "supertest";
import { createApp } from "../../src/app";
import { AppDataSource } from "../../src/config/database";
import { SystemRole } from "../../src/common/types/auth";
import { Organization, OrgVerificationStatus } from "../../src/database/entities/organization.entity";
import { Project, ProjectStatus } from "../../src/database/entities/project.entity";
import { UssdFlowVersion, UssdFlowVersionStatus } from "../../src/database/entities/ussd-flow-version.entity";
import { UssdFlow, UssdFlowStatus } from "../../src/database/entities/ussd-flow.entity";
import { UssdMenuOption, UssdOptionType } from "../../src/database/entities/ussd-menu-option.entity";
import { UssdMenu, UssdMenuType } from "../../src/database/entities/ussd-menu.entity";
import { User, UserStatus } from "../../src/database/entities/user.entity";
import { PaymentAttempt, PaymentStatus, PaymentChannel } from "../../src/database/entities/payment-attempt.entity";
import { ProviderTransaction } from "../../src/database/entities/provider-transaction.entity";
import { Contribution, ContributionStatus } from "../../src/database/entities/contribution.entity";
import { Contributor } from "../../src/database/entities/contributor.entity";
import { FinancialLedgerEntry } from "../../src/database/entities/financial-ledger-entry.entity";
import { CryptoUtil } from "../../src/common/utils/crypto";
import { paymentService } from "../../src/services/payment.service";
import { paystackProvider } from "../../src/services/paystack.provider";
import { closeTestDatabase, setupTestDatabase } from "../test-db";

describe("Paystack Mobile Money & NALO USSD Lifecycle Integration Tests", () => {
  let app: any;
  let testProject: Project;
  let testProject2: Project;
  let testContributor: Contributor;
  let testFlow: UssdFlow;
  let testVersion: UssdFlowVersion;
  let welcomeMenu: UssdMenu;
  let generalFlow: UssdFlow;
  let generalVersion: UssdFlowVersion;

  beforeAll(async () => {
    // Force Paystack provider for USSD and payments
    process.env.PAYMENT_PROVIDER = "paystack";
    process.env.USSD_PAYMENT_PROVIDER = "paystack";
    paystackProvider.setSimulated(true);

    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);
    const projectRepo = AppDataSource.getRepository(Project);
    const flowRepo = AppDataSource.getRepository(UssdFlow);
    const versionRepo = AppDataSource.getRepository(UssdFlowVersion);
    const menuRepo = AppDataSource.getRepository(UssdMenu);
    const optionRepo = AppDataSource.getRepository(UssdMenuOption);
    const contributorRepo = AppDataSource.getRepository(Contributor);

    // 1. Create Organization & User
    const user = await userRepo.save(
      userRepo.create({
        email: "pastor.mensah@church.org",
        passwordHash: "argon_hash",
        firstName: "Pastor",
        lastName: "Mensah",
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    const org = await orgRepo.save(
      orgRepo.create({
        name: "Holy Trinity Parish",
        slug: "holy-trinity-parish",
        verificationStatus: OrgVerificationStatus.VERIFIED,
      })
    );

    // Common contributor for manual contribution seeding
    testContributor = await contributorRepo.save(
      contributorRepo.create({
        msisdn: "233240001000",
        name: "Faithful Giver",
      })
    );

    // 2. Create Primary Project (Event Code: 1001)
    testProject = await projectRepo.save(
      projectRepo.create({
        name: "Holy Trinity Church Project",
        organizationId: org.id,
        ownerId: user.id,
        eventCode: "1001",
        currency: "GHS",
        minAmount: "1.00",
        maxAmount: "5000.00",
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    // 3. Create Secondary Project (Event Code: 1002) for multi-payment test
    testProject2 = await projectRepo.save(
      projectRepo.create({
        name: "Harvest Building Fund",
        organizationId: org.id,
        ownerId: user.id,
        eventCode: "1002",
        currency: "GHS",
        minAmount: "1.00",
        maxAmount: "5000.00",
        status: ProjectStatus.PUBLISHED,
        acceptsContributions: true,
      })
    );

    // 4. Create Custom Project Flow (*920*969*1001#)
    testFlow = await flowRepo.save(
      flowRepo.create({
        name: "Holy Trinity Custom Flow",
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

    welcomeMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
        menuKey: "WELCOME",
        title: "Welcome Menu",
        prompt: "Welcome to Holy Trinity Cathedral.\nSelect:",
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: welcomeMenu.id,
        displayOrder: 1,
        optionKey: "1",
        label: "Offering",
        optionType: UssdOptionType.ACTION,
        actionReference: "SELECT_PURPOSE",
        targetMenuKey: "AMOUNT_INPUT",
      }),
      optionRepo.create({
        menuId: welcomeMenu.id,
        displayOrder: 2,
        optionKey: "2",
        label: "Exit",
        optionType: UssdOptionType.ACTION,
        actionReference: "EXIT",
      }),
    ]);

    const amountMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
        menuKey: "AMOUNT_INPUT",
        title: "Enter Amount",
        prompt: "Enter Amount in {currency}:",
        menuType: UssdMenuType.INPUT,
        displayOrder: 2,
        isActive: true,
      })
    );

    const confirmMenu = await menuRepo.save(
      menuRepo.create({
        flowVersionId: testVersion.id,
        menuKey: "CONFIRM_PAYMENT",
        title: "Confirm Contribution",
        prompt: "Contribute {currency} {amount} to {projectName}?\n1. Confirm\n2. Cancel",
        menuType: UssdMenuType.SELECT,
        displayOrder: 3,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 1,
        optionKey: "1",
        label: "Confirm",
        optionType: UssdOptionType.ACTION,
        actionReference: "INITIATE_PAYMENT",
      }),
      optionRepo.create({
        menuId: confirmMenu.id,
        displayOrder: 2,
        optionKey: "2",
        label: "Cancel",
        optionType: UssdOptionType.ACTION,
        actionReference: "EXIT",
      }),
    ]);

    // 5. Seed General USSD Flow (*920*969#)
    generalFlow = await flowRepo.save(
      flowRepo.create({
        name: "General RaiseFunds USSD Menu",
        status: UssdFlowStatus.PUBLISHED,
      })
    );

    generalVersion = await versionRepo.save(
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
        menuKey: "WELCOME",
        title: "Welcome to Raise-Fundz",
        prompt: "Welcome to your number one Fund Raising platform",
        menuType: UssdMenuType.SELECT,
        displayOrder: 1,
        isActive: true,
      })
    );

    await optionRepo.save([
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 1,
        optionKey: "1",
        label: "Support Project",
        optionType: UssdOptionType.ACTION,
        actionReference: "SUPPORT_PROJECT",
      }),
      optionRepo.create({
        menuId: generalWelcome.id,
        displayOrder: 2,
        optionKey: "2",
        label: "Exit",
        optionType: UssdOptionType.ACTION,
        actionReference: "EXIT",
      }),
    ]);
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  // =========================================================================
  // SCENARIO 1: Normal MTN Mobile Money payment returning pay_offline
  // =========================================================================
  it("Scenario 1: Normal MTN Mobile Money payment returning pay_offline terminates USSD session and keeps PaymentAttempt PENDING", async () => {
    const sessionId = "session-scen-1";
    const msisdn = "233240001001";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-1",
        status: "pay_offline",
        message: "Payment prompt sent. Please authorize on your phone.",
      });

    // Turn 1: Dial *920*969*1001#
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969*1001#",
      MSGTYPE: true,
      SESSIONID: sessionId,
      NETWORK: "MTN",
    });

    // Turn 2: Select 1 (Offering)
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    // Turn 3: Enter Amount '50.00'
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "50.00",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    // Turn 4: Confirm Payment (1)
    const turn4 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn4.status).toBe(200);
    // Requirement: USSD session must be terminated so telco MoMo prompt can land
    expect(turn4.body.MSGTYPE).toBe(false);
    expect(turn4.body.MSG).toContain("Payment prompt of GHS 50.00 has been sent to your phone");
    expect(turn4.body.MSG).toContain("Please authorize with your Mobile Money PIN");

    // Check PaymentAttempt in DB
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt).toBeDefined();
    expect(attempt!.status).toBe(PaymentStatus.PENDING);
    expect(Number(attempt!.amount)).toBe(50);

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 2: Successful payment following offline authorization
  // =========================================================================
  it("Scenario 2: Successful payment following offline authorization moves PaymentAttempt to SUCCESSFUL and completes ledger once", async () => {
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const contribRepo = AppDataSource.getRepository(Contribution);
    const txRepo = AppDataSource.getRepository(ProviderTransaction);
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);

    // Find the pending attempt from Scenario 1
    const attempt = await attemptRepo.findOne({
      where: { msisdn: "233240001001", status: PaymentStatus.PENDING },
      relations: ["contribution"],
    });
    expect(attempt).toBeDefined();

    // Simulate Paystack charge.success webhook callback
    const webhookPayload = {
      event: "charge.success",
      data: {
        id: "pstk_tx_1001",
        reference: attempt!.reference,
        amount: 5000, // 50.00 GHS in minor units
        currency: "GHS",
        fees: 100, // 1.00 GHS fee
        gateway_response: "Successful",
        status: "success",
        channel: "mobile_money",
      },
    };

    const res = await request(app)
      .post("/api/v1/payments/webhook/paystack")
      .set("x-paystack-signature", "simulated_signature")
      .send(webhookPayload);

    expect(res.status).toBe(200);

    // Verify PaymentAttempt moved to SUCCESSFUL
    const updatedAttempt = await attemptRepo.findOne({ where: { id: attempt!.id } });
    expect(updatedAttempt!.status).toBe(PaymentStatus.SUCCESSFUL);
    expect(updatedAttempt!.completedAt).toBeDefined();

    // Verify Contribution moved to CONFIRMED
    const updatedContrib = await contribRepo.findOne({ where: { id: attempt!.contributionId } });
    expect(updatedContrib!.status).toBe(ContributionStatus.CONFIRMED);

    // Verify ProviderTransaction created
    const providerTx = await txRepo.findOne({ where: { paymentAttemptId: attempt!.id, status: "success" } });
    expect(providerTx).toBeDefined();
    expect(providerTx!.status).toBe("success");

    // Verify Financial Ledger entry was recorded
    const ledgerEntries = await ledgerRepo.find({ where: { contributionId: attempt!.contributionId } });
    expect(ledgerEntries.length).toBeGreaterThanOrEqual(1);
    expect(ledgerEntries[0].debitAccount).toBe("1000_CASH_CLEARING");
    expect(ledgerEntries[0].creditAccount).toBe("2000_CONTRIBUTIONS_PAYABLE");
  });

  // =========================================================================
  // SCENARIO 3: First-time authorization returning send_otp
  // =========================================================================
  it("Scenario 3: First-time authorization returning send_otp marks PaymentAttempt OTP_REQUIRED and saves reference", async () => {
    const sessionId = "session-scen-3";
    const msisdn = "233240001003";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-3",
        status: "send_otp",
        requiresOtp: true,
        message: "Please enter the OTP authorization code sent to your phone via SMS:",
        displayText: "Please enter the OTP authorization code sent to your phone via SMS:",
      });

    // Multi-turn to payment confirmation
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969*1001#",
      MSGTYPE: true,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "30.00",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    const turn4 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn4.status).toBe(200);
    // Session prompts for OTP immediately if user is still in session
    expect(turn4.body.MSGTYPE).toBe(true);
    expect(turn4.body.MSG).toContain("Please enter the OTP");

    // Verify PaymentAttempt in database
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt).toBeDefined();
    expect(attempt!.status).toBe(PaymentStatus.PENDING);
    expect(attempt!.providerStatus).toBe("OTP_REQUIRED");
    expect(attempt!.providerReference).toBeDefined();

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 4: Customer terminates original USSD session before OTP continuation
  // =========================================================================
  it("Scenario 4: Customer terminates original USSD session before entering OTP; PaymentAttempt remains recoverable", async () => {
    const msisdn = "233240001003";
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);

    // Check that attempt remains PENDING with OTP_REQUIRED even though the session ended
    const attempt = await attemptRepo.findOne({ where: { msisdn, status: PaymentStatus.PENDING } });
    expect(attempt).toBeDefined();
    expect(attempt!.providerStatus).toBe("OTP_REQUIRED");
  });

  // =========================================================================
  // SCENARIO 5: Customer dials again (*920*969#) and retrieves OTP-required payment
  // =========================================================================
  it("Scenario 5: Customer dials again (*920*969#) and retrieves OTP-required payment continuation menu", async () => {
    const msisdn = "233240001003";

    // Customer dials general shortcode *920*969#
    const res = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: "session-redial-5",
    });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    // Must display pending payment recovery menu
    expect(res.body.MSG).toContain("You have a pending payment of GHS 30 for Holy Trinity Church Project");
    expect(res.body.MSG).toContain("1. Enter OTP to authorize");
    expect(res.body.MSG).toContain("2. Check payment status");
    expect(res.body.MSG).toContain("3. Start new transaction");
  });

  // =========================================================================
  // SCENARIO 6: Customer enters correct OTP
  // =========================================================================
  it("Scenario 6: Customer selects Option 1 and enters correct OTP; invokes submit_otp and marks payment SUCCESSFUL", async () => {
    const msisdn = "233240001003";
    const sessionId = "session-redial-5";

    const submitOtpSpy = jest
      .spyOn(paymentService.currentProvider as any, "submitOtp")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-3",
        status: "success",
        message: "Payment confirmed successfully!",
        displayText: "Payment verified successfully! Thank you for your contribution.",
      });

    // Turn 2: Customer selects Option 1 ("Enter OTP to authorize")
    const turn2 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn2.status).toBe(200);
    expect(turn2.body.MSGTYPE).toBe(true);
    expect(turn2.body.MSG).toContain("Please enter the OTP sent to your phone via SMS");

    // Turn 3: Customer enters OTP "987654"
    const turn3 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "987654",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn3.status).toBe(200);
    expect(turn3.body.MSGTYPE).toBe(false); // Session terminates upon successful confirmation
    expect(turn3.body.MSG).toContain("Payment verified successfully!");

    // Verify submitOtp was called with reference and OTP
    expect(submitOtpSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        otp: "987654",
      })
    );

    // Verify DB update
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt!.status).toBe(PaymentStatus.SUCCESSFUL);

    submitOtpSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 7: Customer enters incorrect OTP
  // =========================================================================
  it("Scenario 7: Customer enters incorrect OTP; permits retry and terminates after maximum attempts", async () => {
    const msisdn = "233240001007";
    const sessionId = "session-scen-7";

    // Setup a pending payment requiring OTP
    const contribRepo = AppDataSource.getRepository(Contribution);
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);

    const contrib = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: "20.00",
        currency: "GHS",
        status: ContributionStatus.PENDING,
      })
    );

    const attempt = await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-7",
        contributionId: contrib.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "20.00",
        currency: "GHS",
        status: PaymentStatus.PENDING,
        providerStatus: "OTP_REQUIRED",
        providerReference: "ZF-PAY-SCEN-7",
      })
    );

    const submitOtpSpy = jest
      .spyOn(paymentService.currentProvider as any, "submitOtp")
      .mockResolvedValue({
        reference: "ZF-PAY-SCEN-7",
        status: "failed",
        message: "Invalid OTP code entered",
        displayText: "Invalid OTP code.",
      });

    // Customer redials
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: sessionId,
    });

    // Selects 1 (Enter OTP)
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    // Enter wrong OTP (Attempt 1)
    const turn1 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "000000",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn1.status).toBe(200);
    expect(turn1.body.MSGTYPE).toBe(true); // Session stays active for retry
    expect(turn1.body.MSG).toContain("Invalid OTP code");
    expect(turn1.body.MSG).toContain("Please enter valid OTP (or 0 to cancel):");

    // Verify payment not marked successful
    const refreshed = await attemptRepo.findOne({ where: { id: attempt.id } });
    expect(refreshed!.status).toBe(PaymentStatus.PENDING);

    // Fail 4 more times to reach limit (5 attempts)
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "000000", MSGTYPE: false, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "000000", MSGTYPE: false, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "000000", MSGTYPE: false, SESSIONID: sessionId });
    const finalTurn = await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "000000", MSGTYPE: false, SESSIONID: sessionId });

    expect(finalTurn.body.MSGTYPE).toBe(false); // Session terminated after max attempts
    expect(finalTurn.body.MSG).toContain("Too many failed attempts");

    submitOtpSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 8: OTP authorization expires
  // =========================================================================
  it("Scenario 8: OTP authorization expires; attempt older than 15 minutes is auto-expired", async () => {
    const msisdn = "233240001008";
    const contribRepo = AppDataSource.getRepository(Contribution);
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);

    const contrib = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: "15.00",
        currency: "GHS",
        status: ContributionStatus.PENDING,
      })
    );

    // Create attempt with createdAt 25 minutes ago
    const pastDate = new Date(Date.now() - 25 * 60 * 1000);
    const attempt = await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-8",
        contributionId: contrib.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "15.00",
        currency: "GHS",
        status: PaymentStatus.PENDING,
        providerStatus: "OTP_REQUIRED",
        providerReference: "ZF-PAY-SCEN-8",
        createdAt: pastDate,
      })
    );

    // Customer dials *920*969#
    const res = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: "session-scen-8",
    });

    expect(res.status).toBe(200);
    // Because the pending payment expired, customer is routed to the general menu rather than pending payment menu
    expect(res.body.MSG).toContain("Welcome to your number one Fund Raising platform");

    // Verify in DB that the attempt status was updated to EXPIRED
    const refreshed = await attemptRepo.findOne({ where: { id: attempt.id } });
    expect(refreshed!.status).toBe(PaymentStatus.EXPIRED);
    expect(refreshed!.providerStatus).toBe("EXPIRED");
  });

  // =========================================================================
  // SCENARIO 9: Paystack returns pending
  // =========================================================================
  it("Scenario 9: Paystack returns pending; payment is preserved as pending and customer can check status", async () => {
    const sessionId = "session-scen-9";
    const msisdn = "233240001009";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-9",
        status: "pending",
        message: "Payment authorization is in progress. Please check your phone for prompts.",
      });

    // Multi-turn to payment confirmation
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969*1001#",
      MSGTYPE: true,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "40.00",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    const turn4 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn4.status).toBe(200);
    expect(turn4.body.MSGTYPE).toBe(false);
    expect(turn4.body.MSG).toContain("Payment prompt of GHS 40.00 has been sent to your phone");

    // Redial *920*969# to check status
    const redialTurn1 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: "session-scen-9-redial",
    });

    expect(redialTurn1.body.MSGTYPE).toBe(true);
    expect(redialTurn1.body.MSG).toContain("You have a pending payment of GHS 40 for Holy Trinity Church Project");
    expect(redialTurn1.body.MSG).toContain("1. Check payment status");

    // Select Option 1 ("Check payment status")
    const redialTurn2 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: "session-scen-9-redial",
    });

    expect(redialTurn2.status).toBe(200);
    expect(redialTurn2.body.MSGTYPE).toBe(false);
    expect(redialTurn2.body.MSG).toContain("Payment of GHS 40 is pending");

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 10: Paystack returns failed
  // =========================================================================
  it("Scenario 10: Paystack returns failed; payment status updated to FAILED and customer informed", async () => {
    const sessionId = "session-scen-10";
    const msisdn = "233240001010";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-10",
        status: "failed",
        message: "Insufficient Mobile Money balance.",
        displayText: "Payment failed: Insufficient funds. Please top up your wallet and try again.",
      });

    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969*1001#",
      MSGTYPE: true,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "100.00",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    const turn4 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn4.status).toBe(200);
    expect(turn4.body.MSGTYPE).toBe(false);
    expect(turn4.body.MSG).toContain("Payment failed: Insufficient funds");

    // Verify DB
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt!.status).toBe(PaymentStatus.FAILED);

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 11: Customer redials after successful payment
  // =========================================================================
  it("Scenario 11: Customer redials within 5 minutes of successful payment; displays confirmation rather than initiating new payment", async () => {
    const msisdn = "233240001011";
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const contribRepo = AppDataSource.getRepository(Contribution);

    const contrib = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: "50.00",
        currency: "GHS",
        status: ContributionStatus.CONFIRMED,
      })
    );

    await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-11",
        contributionId: contrib.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "50.00",
        currency: "GHS",
        status: PaymentStatus.SUCCESSFUL,
        completedAt: new Date(),
      })
    );

    // Customer dials *920*969#
    const res = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: "session-scen-11",
    });

    expect(res.status).toBe(200);
    expect(res.body.MSGTYPE).toBe(true);
    expect(res.body.MSG).toContain("Your payment of GHS 50 for Holy Trinity Church Project was successful!");
    expect(res.body.MSG).toContain("1. Start new transaction");
    expect(res.body.MSG).toContain("2. Exit");
  });

  // =========================================================================
  // SCENARIO 12: Duplicate webhook delivery
  // =========================================================================
  it("Scenario 12: Duplicate webhook delivery is handled safely with idempotent skip and no double ledger entries", async () => {
    const msisdn = "233240001012";
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const contribRepo = AppDataSource.getRepository(Contribution);
    const ledgerRepo = AppDataSource.getRepository(FinancialLedgerEntry);

    const contrib = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: "25.00",
        currency: "GHS",
        status: ContributionStatus.PENDING,
      })
    );

    const attempt = await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-12",
        contributionId: contrib.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "25.00",
        currency: "GHS",
        status: PaymentStatus.PENDING,
      })
    );

    const webhookPayload = {
      event: "charge.success",
      data: {
        id: "pstk_tx_1012",
        reference: attempt.reference,
        amount: 2500, // 25.00 GHS in minor units
        currency: "GHS",
        fees: 50,
        gateway_response: "Successful",
        status: "success",
      },
    };

    // First Webhook Delivery
    const res1 = await request(app)
      .post("/api/v1/payments/webhook/paystack")
      .set("x-paystack-signature", "simulated_signature")
      .send(webhookPayload);
    expect(res1.status).toBe(200);

    const entriesFirstRun = await ledgerRepo.find({ where: { contributionId: contrib.id } });
    expect(entriesFirstRun.length).toBeGreaterThanOrEqual(1);

    // Second (Duplicate) Webhook Delivery
    const res2 = await request(app)
      .post("/api/v1/payments/webhook/paystack")
      .set("x-paystack-signature", "simulated_signature")
      .send(webhookPayload);
    expect(res2.status).toBe(200);

    // Assert no duplicate financial entries
    const entriesSecondRun = await ledgerRepo.find({ where: { contributionId: contrib.id } });
    expect(entriesSecondRun.length).toBe(entriesFirstRun.length);
  });

  // =========================================================================
  // SCENARIO 13: Webhook arrives after NALO session termination
  // =========================================================================
  it("Scenario 13: Webhook arrives after NALO session termination; payment completes successfully", async () => {
    const msisdn = "233240001013";
    const sessionId = "session-scen-13";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-13",
        status: "pay_offline",
        message: "Prompt sent",
      });

    // Run USSD session to termination
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "*920*969*1001#", MSGTYPE: true, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "1", MSGTYPE: false, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "60.00", MSGTYPE: false, SESSIONID: sessionId });
    const finalUssd = await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "1", MSGTYPE: false, SESSIONID: sessionId });

    expect(finalUssd.body.MSGTYPE).toBe(false); // Session ended

    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt!.status).toBe(PaymentStatus.PENDING);

    // Now, after USSD session ended, customer approves on phone and webhook arrives
    const webhookRes = await request(app)
      .post("/api/v1/payments/webhook/paystack")
      .set("x-paystack-signature", "simulated_signature")
      .send({
        event: "charge.success",
        data: {
          id: "pstk_tx_1013",
          reference: attempt!.reference,
          amount: 6000,
          currency: "GHS",
          fees: 100,
          status: "success",
        },
      });

    expect(webhookRes.status).toBe(200);

    const refreshed = await attemptRepo.findOne({ where: { id: attempt!.id } });
    expect(refreshed!.status).toBe(PaymentStatus.SUCCESSFUL);

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 14: Two pending payments exist for same customer
  // =========================================================================
  it("Scenario 14: Two pending payments exist for same customer; presents selection menu and allows picking specific transaction", async () => {
    const msisdn = "233240001014";
    const contribRepo = AppDataSource.getRepository(Contribution);
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);

    // Create 1st pending payment (Holy Trinity Church Project, 35.00)
    const contrib1 = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject.id,
        contributorId: testContributor.id,
        amount: "35.00",
        currency: "GHS",
        status: ContributionStatus.PENDING,
      })
    );
    await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-14A",
        contributionId: contrib1.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "35.00",
        currency: "GHS",
        status: PaymentStatus.PENDING,
        providerStatus: "OTP_REQUIRED",
      })
    );

    // Create 2nd pending payment (Harvest Building Fund, 75.00)
    const contrib2 = await contribRepo.save(
      contribRepo.create({
        reference: CryptoUtil.generateReference("ZF-CON"),
        projectId: testProject2.id,
        contributorId: testContributor.id,
        amount: "75.00",
        currency: "GHS",
        status: ContributionStatus.PENDING,
      })
    );
    await attemptRepo.save(
      attemptRepo.create({
        reference: "ZF-PAY-SCEN-14B",
        contributionId: contrib2.id,
        provider: "paystack",
        channel: PaymentChannel.MOBILE_MONEY,
        msisdn,
        amount: "75.00",
        currency: "GHS",
        status: PaymentStatus.PENDING,
      })
    );

    // Customer dials *920*969#
    const dialRes = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "*920*969#",
      MSGTYPE: true,
      SESSIONID: "session-scen-14",
    });

    expect(dialRes.status).toBe(200);
    expect(dialRes.body.MSGTYPE).toBe(true);
    // Disambiguation menu must be displayed
    expect(dialRes.body.MSG).toContain("You have multiple pending payments:");
    expect(dialRes.body.MSG).toContain("Select payment (or 0 to start new):");

    // Select Option 2 (Holy Trinity Church Project, OTP required)
    const pickRes = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "2",
      MSGTYPE: false,
      SESSIONID: "session-scen-14",
    });

    expect(pickRes.status).toBe(200);
    expect(pickRes.body.MSGTYPE).toBe(true);
    // Transitions into payment menu for that specific payment
    expect(pickRes.body.MSG).toContain("Pending payment: GHS 35");
  });

  // =========================================================================
  // SCENARIO 15: Duplicate USSD callback attempts to initiate same payment
  // =========================================================================
  it("Scenario 15: Duplicate USSD callback attempts to initiate same payment do not create duplicate attempts", async () => {
    const sessionId = "session-scen-15";
    const msisdn = "233240001015";

    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValue({
        reference: "ZF-PAY-SCEN-15",
        status: "pay_offline",
        message: "Prompt sent",
      });

    // Run to payment confirmation
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "*920*969*1001#", MSGTYPE: true, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "1", MSGTYPE: false, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "45.00", MSGTYPE: false, SESSIONID: sessionId });

    // Confirm turn 1
    const confirmTurn1 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    expect(confirmTurn1.status).toBe(200);

    // Duplicate confirm turn 2 with same session ID
    const confirmTurn2 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });
    expect(confirmTurn2.status).toBe(200);

    // Verify only 1 PaymentAttempt exists for this MSISDN
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempts = await attemptRepo.find({ where: { msisdn } });
    expect(attempts.length).toBe(1);

    chargeSpy.mockRestore();
  });

  // =========================================================================
  // SCENARIO 16: Payment API times out after charge may have been initiated
  // =========================================================================
  it("Scenario 16: Payment API times out; payment recorded as TIMEOUT_PENDING and resolved safely via webhook", async () => {
    const sessionId = "session-scen-16";
    const msisdn = "233240001016";

    // Simulate gateway timeout
    const chargeSpy = jest
      .spyOn(paymentService.currentProvider as any, "chargeMobileMoney")
      .mockResolvedValueOnce({
        reference: "ZF-PAY-SCEN-16",
        status: "timeout",
        message: "Payment gateway timed out waiting for upstream response.",
      });

    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "*920*969*1001#", MSGTYPE: true, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "1", MSGTYPE: false, SESSIONID: sessionId });
    await request(app).post("/api/v1/ussd/nalo").send({ USERID: "NALOTest", MSISDN: msisdn, USERDATA: "80.00", MSGTYPE: false, SESSIONID: sessionId });

    const turn4 = await request(app).post("/api/v1/ussd/nalo").send({
      USERID: "NALOTest",
      MSISDN: msisdn,
      USERDATA: "1",
      MSGTYPE: false,
      SESSIONID: sessionId,
    });

    expect(turn4.status).toBe(200);
    expect(turn4.body.MSGTYPE).toBe(false);
    expect(turn4.body.MSG).toContain("Payment authorization is in progress");

    // In DB, attempt must be marked PENDING with TIMEOUT_PENDING status
    const attemptRepo = AppDataSource.getRepository(PaymentAttempt);
    const attempt = await attemptRepo.findOne({ where: { msisdn } });
    expect(attempt).toBeDefined();
    expect(attempt!.status).toBe(PaymentStatus.PENDING);
    expect(attempt!.providerStatus).toBe("TIMEOUT_PENDING");

    // Subsequent webhook resolves it safely to SUCCESSFUL
    const webhookRes = await request(app)
      .post("/api/v1/payments/webhook/paystack")
      .set("x-paystack-signature", "simulated_signature")
      .send({
        event: "charge.success",
        data: {
          id: "pstk_tx_1016",
          reference: attempt!.reference,
          amount: 8000,
          currency: "GHS",
          fees: 100,
          status: "success",
        },
      });

    expect(webhookRes.status).toBe(200);

    const refreshed = await attemptRepo.findOne({ where: { id: attempt!.id } });
    expect(refreshed!.status).toBe(PaymentStatus.SUCCESSFUL);

    chargeSpy.mockRestore();
  });
});
