import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/config/database';
import { CryptoUtil } from '../../src/common/utils/crypto';
import { SystemRole } from '../../src/common/types/auth';
import {
  DocumentEntityType,
  DocumentRecord,
  DocumentType,
  DocumentVerificationStatus,
} from '../../src/database/entities/document-record.entity';
import { Organization, OrgVerificationStatus } from '../../src/database/entities/organization.entity';
import { User, UserStatus } from '../../src/database/entities/user.entity';
import { closeTestDatabase, setupTestDatabase } from '../test-db';

describe('Document Upload, Verification & Access Control Workflow', () => {
  let app: any;
  let uploaderUser: User;
  let otherOrgUser: User;
  let verificationOfficer: User;
  let testOrg: Organization;

  let uploaderToken: string;
  let otherUserToken: string;
  let verificationOfficerToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    app = createApp();

    const userRepo = AppDataSource.getRepository(User);
    const orgRepo = AppDataSource.getRepository(Organization);

    // 1. Account Owner from Org A
    uploaderUser = await userRepo.save(
      userRepo.create({
        email: 'founder@ngo-ghana.org',
        passwordHash: 'hash',
        firstName: 'Kwame',
        lastName: 'Nkrumah',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    // 2. Account Owner from Org B (Unrelated third party)
    otherOrgUser = await userRepo.save(
      userRepo.create({
        email: 'other@competitor.org',
        passwordHash: 'hash',
        firstName: 'Kojo',
        lastName: 'Antwi',
        role: SystemRole.ACCOUNT_OWNER,
        status: UserStatus.ACTIVE,
      })
    );

    // 3. Platform Verification Officer
    verificationOfficer = await userRepo.save(
      userRepo.create({
        email: 'compliance@zfund.org',
        passwordHash: 'hash',
        firstName: 'Esi',
        lastName: 'Tetteh',
        role: SystemRole.VERIFICATION_OFFICER,
        status: UserStatus.ACTIVE,
      })
    );

    testOrg = await orgRepo.save(
      orgRepo.create({
        name: 'Ghana Youth Foundation',
        slug: 'ghana-youth-foundation',
        verificationStatus: OrgVerificationStatus.PENDING,
      })
    );

    uploaderToken = CryptoUtil.generateAccessToken({
      userId: uploaderUser.id,
      email: uploaderUser.email,
      role: uploaderUser.role,
    });

    otherUserToken = CryptoUtil.generateAccessToken({
      userId: otherOrgUser.id,
      email: otherOrgUser.email,
      role: otherOrgUser.role,
    });

    verificationOfficerToken = CryptoUtil.generateAccessToken({
      userId: verificationOfficer.id,
      email: verificationOfficer.email,
      role: verificationOfficer.role,
    });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  let uploadedDocumentId = '';

  it('should upload a verification document and save securely in private storage', async () => {
    const fakePdfBuffer = Buffer.from('%PDF-1.4 Fake PDF Content for Organization Registration Certificate');

    const res = await request(app)
      .post('/api/v1/documents/upload')
      .set('Authorization', `Bearer ${uploaderToken}`)
      .attach('file', fakePdfBuffer, 'incorporation_certificate.pdf')
      .field('entityType', DocumentEntityType.ORGANIZATION)
      .field('entityId', testOrg.id)
      .field('documentType', DocumentType.CERTIFICATE_OF_INCORPORATION);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.originalFilename).toBe('incorporation_certificate.pdf');
    expect(res.body.data.verificationStatus).toBe(DocumentVerificationStatus.PENDING);
    // Absolute server storage path must NOT be leaked directly to clients
    expect(res.body.data.filePath).toBeUndefined();

    uploadedDocumentId = res.body.data.id;
  });

  it('SECURITY TEST: Unrelated third-party user must be DENIED access (403 Forbidden) to private document metadata', async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${uploadedDocumentId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('permission to view this private document');
  });

  it('SECURITY TEST: Unrelated third-party user must be DENIED download (403 Forbidden)', async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${uploadedDocumentId}/download`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow the original uploader to view document metadata', async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${uploadedDocumentId}`)
      .set('Authorization', `Bearer ${uploaderToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.originalFilename).toBe('incorporation_certificate.pdf');
  });

  it('should allow the original uploader to download the private document stream', async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${uploadedDocumentId}/download`)
      .set('Authorization', `Bearer ${uploaderToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.body.toString()).toContain('Fake PDF Content');
  });

  it('should allow Verification Officer to review and approve the document', async () => {
    const res = await request(app)
      .patch(`/api/v1/documents/${uploadedDocumentId}/review`)
      .set('Authorization', `Bearer ${verificationOfficerToken}`)
      .send({
        status: DocumentVerificationStatus.VERIFIED,
        reviewNotes: 'Incorporation certificate cross-referenced with Registrar Generals Department. Verified.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verificationStatus).toBe(DocumentVerificationStatus.VERIFIED);
    expect(res.body.data.reviewNotes).toContain('Registrar Generals Department');

    // Verify in database that reviewer was recorded
    const docRepo = AppDataSource.getRepository(DocumentRecord);
    const dbDoc = await docRepo.findOne({ where: { id: uploadedDocumentId } });
    expect(dbDoc?.verificationStatus).toBe(DocumentVerificationStatus.VERIFIED);
    expect(dbDoc?.reviewerId).toBe(verificationOfficer.id);
  });
});
