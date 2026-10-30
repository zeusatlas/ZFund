# ZFund Security Architecture & Compliance Guidelines

This document details the security controls, cryptographic standards, token lifecycle, authorization architecture, and data privacy defenses implemented across ZFund.

---

## 1. Authentication & Password Security

### 1.1 Argon2id Password Hashing
ZFund uses **Argon2id** (winner of the Password Hashing Competition) with parameters configured in `src/config/env.ts`:
- **Algorithm:** `argon2id` (resistant to both GPU side-channel and ASIC attacks)
- **Memory Cost:** `65,536 KB` (64 MB)
- **Time Cost:** `3` iterations
- **Parallelism:** Defaults to hardware threads

### 1.2 Access & Refresh Token Architecture
- **Access Tokens:** Signed via HMAC SHA-256 (`env.JWT_ACCESS_SECRET`) with a short expiration lifetime (`15 minutes`).
- **Refresh Tokens:** Long-lived tokens (`7 days`).
- **Server-Side Token Hashing:** Refresh tokens are **never stored in plaintext** in PostgreSQL. The system stores a **SHA-256 hash** (`tokenHash`) in `refresh_tokens`. Even if the database is read or dumped, stored session hashes cannot be used to forge valid JWTs.
- **Token Rotation & Replay Attack Protection:** Each refresh operation revokes the presented refresh token and issues a new pair with a unique `jti` identifier. If a revoked refresh token is presented again, the system detects a token replay attack and immediately revokes all active sessions for that user.
- **Cookie Security:** Refresh tokens are delivered via `HttpOnly`, `Secure` (in production), `SameSite: 'lax'` cookies, preventing XSS-based token theft.

---

## 2. Role-Based Access Control (RBAC)

ZFund implements role-based authorization enforced via route middleware:

### System Roles
1. `SUPER_ADMIN`: Root platform administrator with global access across all organizations and system settings.
2. `PLATFORM_ADMIN`: Operational administration, project approvals, account management.
3. `VERIFICATION_OFFICER`: Compliance officer reviewing uploaded KYC documents and verifying organizations.
4. `FINANCE_OFFICER`: Financial auditor reviewing and processing refunds and reconciliations.
5. `ACCOUNT_OWNER`: Owner of a personal account or organization projects.
6. `ORG_ADMIN`: Administrator within a specific organization.
7. `PROJECT_MANAGER`: Manager assigned to configure and view a specific project.
8. `AUDITOR`: Read-only auditor of financial and compliance logs.

### Multi-Tenant Boundary Enforcement
Protected endpoints verify that a user belongs to the target organization before granting write or read access. Attempts by users from Organization A to view or modify resources belonging to Organization B are rejected with `403 Forbidden`.

---

## 3. Private Document Upload Security

Identity cards, business registration certificates, and financial verification documents are strictly protected:
- **Private Storage:** Uploaded files are stored in `storage/documents/` (completely isolated from public static Express routes).
- **Random Storage Filenames:** Stored filenames are generated using timestamped UUIDs (`<timestamp>-<uuid>.<ext>`) to prevent path traversal or original filename collision attacks.
- **MIME & Size Restrictions:** Multer middleware validates MIME types (`application/pdf`, `image/jpeg`, `image/png`) and limits upload size to 10 MB.
- **Streaming Authorization:** Files can only be downloaded via `GET /api/v1/documents/:id/download`. The endpoint verifies that the caller is either the original uploader or platform compliance staff (`VERIFICATION_OFFICER`, `SUPER_ADMIN`).
- **Storage Path Redaction:** Absolute server paths (`filePath`) are scrubbed before serialization.

---

## 4. Webhook & External Gateway Security

- **RobsPay Webhook & Callback Authentication:** Verified using HMAC-SHA256 with timing-safe comparison (`CryptoUtil.verifyRobsPaySignature`).
- **Durable Idempotency:** Webhook processing relies on database constraints (`provider_webhook_events`) rather than Redis alone. Duplicate requests cannot produce duplicate ledger entries.
- **USSD Allowlisted Actions:** Menus in PostgreSQL select from allowlisted actions in `UssdActionRegistry`. Arbitrary code execution or SQL strings in USSD configurations are impossible.

---

## 5. Logging & Sensitive Data Redaction

All logging is handled via **Pino** (`src/config/logger.ts`). Secrets and personally identifiable credentials are automatically redacted before outputting:
- `req.headers.authorization`
- `password`, `oldPassword`, `newPassword`
- `refreshToken`, `token`
- `pin`, `otp`
- `robspayApiKey`
