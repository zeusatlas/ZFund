import { Router } from 'express';
import adminRoutes from './admin.routes';
import auditRoutes from './audit.routes';
import authRoutes from './auth.routes';
import contributionRoutes from './contribution.routes';
import documentRoutes from './document.routes';
import financialRoutes from './financial.routes';
import healthRoutes from './health.routes';
import notificationRoutes from './notification.routes';
import organizationRoutes from './organization.routes';
import paymentRoutes from './payment.routes';
import projectRoutes from './project.routes';
import refundRoutes from './refund.routes';
import userRoutes from './user.routes';
import withdrawalRoutes from './withdrawal.routes';
import ussdFlowRoutes from './ussd-flow.routes';
import ussdRuntimeRoutes from './ussd-runtime.routes';

const router = Router();

// Health and System Diagnostics
router.use('/system', healthRoutes);

// Authentication & Identity
router.use('/auth', authRoutes);

// Users Management
router.use('/users', userRoutes);

// Organizations & KYC
router.use('/organizations', organizationRoutes);

// Projects & Campaigns
router.use('/projects', projectRoutes);

// USSD Gateway Runtime & Flow Builder
router.use('/ussd', ussdRuntimeRoutes); // Public NALO callback endpoint
router.use('/ussd/flows', ussdFlowRoutes); // Authenticated USSD menu builder
router.use('/ussd-flows', ussdFlowRoutes); // Authenticated USSD flow endpoint

// Payments & Webhooks
router.use('/payments', paymentRoutes);

// Contributions
router.use('/contributions', contributionRoutes);

// Refunds & Approvals
router.use('/refunds', refundRoutes);

// Financial Ledger & Accounting
router.use('/financial', financialRoutes);

// Notifications & SMS
router.use('/notifications', notificationRoutes);

// Document Storage
router.use('/documents', documentRoutes);

// Host Withdrawal Requests
router.use('/withdrawals', withdrawalRoutes);

// Admin Dashboard
router.use('/admin', adminRoutes);

// Audit Logging
router.use('/audit', auditRoutes);

export default router;
