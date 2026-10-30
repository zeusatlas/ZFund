# ZFund Database Architecture & TypeORM Synchronization Guide

This document details the PostgreSQL database design, all 39 registered entities, foreign-key relationships, indexes, and explicit guidelines for managing schema evolution with **TypeORM `synchronize: true`** without database migrations.

---

## 1. Zero-Migration Strategy with TypeORM Synchronization

ZFund uses **TypeORM schema synchronization (`synchronize: true`)**. **No database migrations or migration directories are used.**

### 1.1 Environment Safety Controls
Schema synchronization modifies database tables at application initialization based on the TypeScript entity metadata. To prevent accidental data alteration in sensitive environments:

1. **Development & Testing:** `TYPEORM_SYNCHRONIZE=true` automatically syncs the schema on boot.
2. **Production Safeguard:**
   In `src/config/env.ts`, `TYPEORM_SYNCHRONIZE` is validated. If `NODE_ENV === 'production'`, `TYPEORM_SYNCHRONIZE` defaults to `false` unless explicitly overridden via `TYPEORM_ALLOW_PROD_SYNC=true`.
3. **No Schema Drops:** `dropSchema: false` is strictly enforced. The application will never execute a drop-schema operation on boot.

### 1.2 Schema Evolution Discipline
Because migrations are not used:
- **Adding new columns:** Ensure new non-nullable columns specify a `default` value (e.g. `@Column({ default: 'ACTIVE' })`).
- **Renaming columns:** Renaming a property in an entity will cause TypeORM to create a new column and leave the old column orphaned. Rename operations must be planned with database administration if preserving historical column data is required.
- **Removing columns:** Never delete columns containing historical financial data.
- **Indexes & Constraints:** Defined directly via `@Index()` and `@Column({ unique: true })` decorators.

---

## 2. Complete Inventory of Registered Entities (39 Entities)

All 39 entities are centrally registered in `src/database/entities.ts` and loaded by `AppDataSource`:

### 2.1 Identity & Access Control (7 Entities)
1. **`User`** (`users`): Primary account holder, credentials, status (`ACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`), system role.
2. **`Role`** (`roles`): RBAC role definitions with hierarchical descriptions.
3. **`Permission`** (`permissions`): Granular system permissions (`PROJECT_CREATE`, `REFUND_APPROVE`, etc.).
4. **`RolePermission`** (`role_permissions`): Junction table mapping roles to permissions.
5. **`RefreshToken`** (`refresh_tokens`): Hashed refresh token sessions (`tokenHash` SHA-256), revocation tracking, expiry.
6. **`PasswordResetToken`** (`password_reset_tokens`): Time-limited, single-use password reset hashes.
7. **`AuthEvent`** (`auth_events`): Security audit log of logins, logouts, failures, and password changes.

### 2.2 Organizations (2 Entities)
8. **`Organization`** (`organizations`): Legal entity / group profile, slug, verification status (`UNVERIFIED`, `PENDING`, `VERIFIED`, `REJECTED`).
9. **`OrganizationMember`** (`organization_members`): Maps users to organizations with membership roles (`OWNER`, `ADMIN`, `MEMBER`, `FINANCE`).

### 2.3 Projects & Contribution Setup (7 Entities)
10. **`Project`** (`projects`): Contribution campaign, unique USSD `eventCode`, currency, targets, status (`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `SUSPENDED`, `COMPLETED`, `ARCHIVED`).
11. **`ProjectMember`** (`project_members`): Authorized staff assigned to manage specific projects.
12. **`ProjectCategory`** (`project_categories`): Configurable categories (Church, School, Funeral, Alumni, Medical).
13. **`ContributionPurpose`** (`contribution_purposes`): Global or organization-level contribution purposes (Tithe, Offering, Dues, Building).
14. **`ProjectContributionPurpose`** (`project_contribution_purposes`): Links specific purposes to a project with display order.
15. **`ProjectPaymentMethod`** (`project_payment_methods`): Configured payment channels per project (Mobile Money, Card).
16. **`ProjectSetting`** (`project_settings`): Key-value project configuration options.

### 2.4 USSD State Machine & Menus (6 Entities)
17. **`UssdFlow`** (`ussd_flows`): Represents a dynamic USSD flow (General `*920*969#` or Project-specific).
18. **`UssdFlowVersion`** (`ussd_flow_versions`): Versioned flow snapshots with status (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
19. **`UssdMenu`** (`ussd_menus`): Menu definitions, prompt text, menu type (`STATIC_OPTIONS`, `AMOUNT_INPUT`, `CONFIRMATION`, `ACTION`).
20. **`UssdMenuOption`** (`ussd_menu_options`): Options per menu with display order, option keys (`1`, `2`), target menus, and action keys.
21. **`UssdSession`** (`ussd_sessions`): Durable PostgreSQL session history, navigation state, msisdn, associated payment attempt.
22. **`UssdSessionEvent`** (`ussd_session_events`): Step-by-step audit record of contributor inputs and rendered responses.

### 2.5 Financial Ledger & Payments (11 Entities)
23. **`Contributor`** (`contributors`): Contributor registry identified by mobile phone number (`msisdn`), optional name and email.
24. **`Contribution`** (`contributions`): The business contribution record (`reference` `ZF-CON-...`), amount (`NUMERIC(14,2)`), purpose, status (`INITIATED`, `CONFIRMED`, `PARTIALLY_REFUNDED`, `REFUNDED`, `FAILED`).
25. **`PaymentProvider`** (`payment_providers`): Integrated payment gateways (RobsPay, etc.).
26. **`PaymentAttempt`** (`payment_attempts`): Individual collection attempts (`reference` `ZF-PAY-...`), provider reference, fee, channel, status (`INITIATED`, `PENDING`, `SUCCESSFUL`, `FAILED`).
27. **`ProviderTransaction`** (`provider_transactions`): External gateway transaction logs and raw response payloads.
28. **`ProviderWebhookEvent`** (`provider_webhook_events`): Raw incoming webhook logs with idempotency tracking (`isProcessed: boolean`).
29. **`Refund`** (`refunds`): Refund requests (`reference` `ZF-REF-...`), amount, status (`REQUESTED`, `APPROVED`, `PROCESSING`, `COMPLETED`, `REJECTED`), reviewer notes.
30. **`FinancialLedgerAccount`** (`financial_ledger_accounts`): Chart of accounts (Cash/Clearing `1000`, Payable `2000`, Fees `5000`).
31. **`FinancialLedgerEntry`** (`financial_ledger_entries`): Double-entry accounting ledger entries (`debitAccount`, `creditAccount`, `amount`, `currency`).
32. **`ReconciliationRun`** (`reconciliation_runs`): Batch reconciliation records.
33. **`ReconciliationRecord`** (`reconciliation_records`): Discrepancy details from reconciliation runs.

### 2.6 Documents & Messaging (4 Entities)
34. **`DocumentRecord`** (`document_records`): Private metadata for uploaded KYC/verification files, storage path, status.
35. **`NotificationTemplate`** (`notification_templates`): Database-driven SMS/email templates with safe placeholders (`{projectName}`, `{amount}`).
36. **`Notification`** (`notifications`): Outbox notification records, delivery status (`QUEUED`, `SENT`, `FAILED`).
37. **`NotificationDeliveryAttempt`** (`notification_delivery_attempts`): Delivery attempts, provider message IDs, failure errors.

### 2.7 Operations & Auditing (2 Entities)
38. **`AuditLog`** (`audit_logs`): Immutable audit trail recording user, action, entity type, entity ID, old values, new values, IP, user-agent.
39. **`SystemSetting`** (`system_settings`): Platform-level configuration parameters.

---

## 3. Financial Invariants & Data Integrity

1. **Decimal Safety:** All currency amounts use PostgreSQL `NUMERIC(14, 2)`. JavaScript floating-point math is strictly forbidden; all additions, subtractions, and comparisons use `BigNumber.js` via `MoneyUtil`.
2. **Double-Entry Bookkeeping:** Confirmed payments generate balanced ledger records:
   - Debit: `1000_CASH_CLEARING`
   - Credit: `2000_CONTRIBUTIONS_PAYABLE`
   - Gateway Fees: Debit `5000_PAYMENT_GATEWAY_FEE`, Credit `1000_CASH_CLEARING`.
3. **No Soft Deletes on Financials:** Contributions, payment attempts, provider transactions, and ledger entries are NEVER deleted. Changes require reversing ledger adjustments or refunds.
