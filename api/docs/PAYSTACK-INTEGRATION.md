# Paystack Payment Integration Guide

This document describes the implementation, security standards, Mobile Money collection flow, webhook processing, and refund mechanics for the **Paystack** integration.

---

## 1. Architectural Abstraction: `IPaymentProvider`

Paystack is implemented behind the clean, provider-agnostic interface `IPaymentProvider`:

```typescript
export interface IPaymentProvider {
  readonly code: string;
  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyTransaction(reference: string): Promise<VerifyTransactionResult>;
  initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult>;
}
```

This guarantees that core business services (`PaymentService`, `RefundService`, `ContributionService`) never depend directly on Paystack-specific response structures or internal endpoints.

---

## 2. Mobile Money Contribution Lifecycle

```
[ Contributor (USSD/Web) ]
           │
           ▼
1. PaymentService.initiatePayment()
   ├── Creates Contributor record (indexed by msisdn)
   ├── Generates Contribution record ('ZF-CON-...')
   ├── Generates PaymentAttempt ('ZF-PAY-...')
   └── Calls PaystackProvider.initializePayment()
           │
           ▼
2. Paystack API (/transaction/initialize)
   ├── Amount converted from major (GHS) to minor units (pesewas: amount * 100)
   ├── Channel: ['mobile_money']
   └── Paystack dispatches prompt to contributor's mobile device
           │
           ▼
3. Mobile Network Operator Prompt (USSD Push / OTP)
   └── Subscriber enters MoMo PIN on their mobile handset
           │
           ▼
4. Paystack Webhook Callback
   └── POST /api/v1/payments/webhook/paystack
```

---

## 3. Webhook Authentication & Security

Paystack signs all webhook payloads with an HMAC SHA-512 digest computed using the secret key (`PAYSTACK_WEBHOOK_SECRET`).

### 3.1 Verification Middleware (`paystackWebhookAuth`)
The middleware in `src/common/middleware/paystack-auth.middleware.ts`:
1. Reads `x-paystack-signature` header.
2. Extracts raw request body captured by `express.json({ verify: ... })`.
3. Computes HMAC SHA-512 digest:
   ```typescript
   const computed = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
   ```
4. Compares digests using length check and `crypto.timingSafeEqual` to prevent timing attacks.
5. Rejects any invalid or missing signature with `401 Unauthorized`.

---

## 4. Idempotency & Concurrency Safety

Webhooks may be delivered multiple times by Paystack due to network retries.

### Idempotency Protection Flow:
1. `PaymentService.handleWebhook` queries `provider_webhook_events` for `(reference, eventType, isProcessed: true)`.
2. If already processed, it immediately logs `(idempotent skip)` and returns `200 OK` without re-executing any ledger entries or state transitions.
3. If not processed, it wraps the entire status transition and double-entry ledger creation inside an atomic `AppDataSource.transaction`:
   - Updates `payment_attempts.status = 'SUCCESSFUL'`.
   - Updates `contributions.status = 'CONFIRMED'`.
   - Inserts `provider_transactions` record.
   - Inserts double-entry records in `financial_ledger_entries`.
   - Sets `provider_webhook_events.isProcessed = true`.

---

## 5. Refunds Integration

When an authorized user requests and approves a refund:
1. `RefundService.processRefund` invokes `paystackProvider.initiateRefund({ transactionReference, amount, merchantNote })`.
2. Converts major units to minor units (pesewas).
3. Posts to `https://api.paystack.co/refund`.
4. Saves `providerRefundId` and marks `refunds.status = 'COMPLETED'`.
5. Updates financial ledger: Debit `2000_CONTRIBUTIONS_PAYABLE`, Credit `1000_CASH_CLEARING`.
6. Transitions contribution to `PARTIALLY_REFUNDED` or `REFUNDED`.
