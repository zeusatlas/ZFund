// Re-export all entities and enums for centralized domain access
export * from './entities/audit-log.entity';
export * from './entities/withdrawal-request.entity';
export * from './entities/contribution.entity';
export * from './entities/contributor.entity';
export * from './entities/document-record.entity';
export * from './entities/financial-ledger-account.entity';
export * from './entities/financial-ledger-entry.entity';
export * from './entities/reconciliation-record.entity';
export * from './entities/reconciliation-run.entity';
export * from './entities/notification-delivery-attempt.entity';
export * from './entities/notification-template.entity';
export * from './entities/notification.entity';
export * from './entities/organization-member.entity';
export * from './entities/organization.entity';
export * from './entities/payment-attempt.entity';
export * from './entities/payment-provider.entity';
export * from './entities/provider-transaction.entity';
export * from './entities/provider-webhook-event.entity';
export * from './entities/contribution-purpose.entity';
export * from './entities/project-category.entity';
export * from './entities/project-contribution-purpose.entity';
export * from './entities/project-member.entity';
export * from './entities/project-payment-method.entity';
export * from './entities/project-setting.entity';
export * from './entities/project.entity';
export * from './entities/refund.entity';
export * from './entities/system-setting.entity';
export * from './entities/ussd-flow-version.entity';
export * from './entities/ussd-flow.entity';
export * from './entities/ussd-menu-option.entity';
export * from './entities/ussd-menu.entity';
export * from './entities/ussd-session-event.entity';
export * from './entities/ussd-session.entity';
export * from './entities/auth-event.entity';
export * from './entities/password-reset-token.entity';
export * from './entities/permission.entity';
export * from './entities/refresh-token.entity';
export * from './entities/role-permission.entity';
export * from './entities/role.entity';
export * from './entities/user.entity';

import { AuditLog } from './entities/audit-log.entity';
import { Contribution } from './entities/contribution.entity';
import { Contributor } from './entities/contributor.entity';
import { DocumentRecord } from './entities/document-record.entity';
import { FinancialLedgerAccount } from './entities/financial-ledger-account.entity';
import { FinancialLedgerEntry } from './entities/financial-ledger-entry.entity';
import { ReconciliationRecord } from './entities/reconciliation-record.entity';
import { ReconciliationRun } from './entities/reconciliation-run.entity';
import { NotificationDeliveryAttempt } from './entities/notification-delivery-attempt.entity';
import { NotificationTemplate } from './entities/notification-template.entity';
import { Notification } from './entities/notification.entity';
import { OrganizationMember } from './entities/organization-member.entity';
import { Organization } from './entities/organization.entity';
import { PaymentAttempt } from './entities/payment-attempt.entity';
import { PaymentProvider } from './entities/payment-provider.entity';
import { ProviderTransaction } from './entities/provider-transaction.entity';
import { ProviderWebhookEvent } from './entities/provider-webhook-event.entity';
import { ContributionPurpose } from './entities/contribution-purpose.entity';
import { ProjectCategory } from './entities/project-category.entity';
import { ProjectContributionPurpose } from './entities/project-contribution-purpose.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectPaymentMethod } from './entities/project-payment-method.entity';
import { ProjectSetting } from './entities/project-setting.entity';
import { Project } from './entities/project.entity';
import { Refund } from './entities/refund.entity';
import { SystemSetting } from './entities/system-setting.entity';
import { UssdFlowVersion } from './entities/ussd-flow-version.entity';
import { UssdFlow } from './entities/ussd-flow.entity';
import { UssdMenuOption } from './entities/ussd-menu-option.entity';
import { UssdMenu } from './entities/ussd-menu.entity';
import { UssdSessionEvent } from './entities/ussd-session-event.entity';
import { UssdSession } from './entities/ussd-session.entity';
import { AuthEvent } from './entities/auth-event.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { Permission } from './entities/permission.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { WithdrawalRequest } from './entities/withdrawal-request.entity';

export const allEntities = [
  // Identity & Access
  User,
  Role,
  Permission,
  RolePermission,
  RefreshToken,
  PasswordResetToken,
  AuthEvent,

  // Organizations
  Organization,
  OrganizationMember,

  // Projects
  ProjectCategory,
  Project,
  ProjectMember,
  ContributionPurpose,
  ProjectContributionPurpose,
  ProjectPaymentMethod,
  ProjectSetting,

  // USSD
  UssdFlow,
  UssdFlowVersion,
  UssdMenu,
  UssdMenuOption,
  UssdSession,
  UssdSessionEvent,

  // Contributions
  Contributor,
  Contribution,

  // Payments
  PaymentProvider,
  PaymentAttempt,
  ProviderTransaction,
  ProviderWebhookEvent,

  // Refunds
  Refund,

  // Withdrawals
  WithdrawalRequest,

  // Financial Ledger & Reconciliation
  FinancialLedgerAccount,
  FinancialLedgerEntry,
  ReconciliationRun,
  ReconciliationRecord,

  // Documents
  DocumentRecord,

  // Messaging & Notifications
  NotificationTemplate,
  Notification,
  NotificationDeliveryAttempt,

  // Operations & System
  AuditLog,
  SystemSetting,
];
