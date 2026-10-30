# RobsPay Payment Integration Guide

This document describes the implementation, security standards, Mobile Money collection flow, webhook/callback processing, and refund mechanics for the **RobsPay** (`robspay.robsamtechnologies.com`) integration.

---

## 1. Architectural Abstraction: `IPaymentProvider`

RobsPay is implemented behind the clean, provider-agnostic interface `IPaymentProvider`:

```typescript
export interface IPaymentProvider {
  readonly code: string;
  initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verifyTransaction(reference: string): Promise<VerifyTransactionResult>;
  initiateRefund(params: InitiateRefundParams): Promise<InitiateRefundResult>;
}
```

This guarantees that core business services (`PaymentService`, `RefundService`, `ContributionService`) never depend directly on RobsPay-specific response structures or internal endpoints.

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
   └── Calls robspayProvider.initializePayment()
           │
           ▼
2. RobsPay Collection API (POST /apis/v1/collect-payment)
   ├── Endpoint: https://robspay.robsamtechnologies.com/apis/v1/collect-payment
   ├── Order ID: 12-char uppercase hex ('23B0F51B8380')
   ├── Signature: HMAC-SHA256(payload + timestamp, apiKey)
   ├── Header: Authorization: API_KEY:SIGNATURE
   ├── Header: X-TIMESTAMP: timestamp
   └── RobsPay initiates USSD prompt / push to contributor's mobile device
           │
           ▼
3. Mobile Network Operator Prompt (USSD Push / PIN entry)
   ├── MTN / Telecel: Direct screen prompt for Mobile Money PIN
   ├── AT Money: Direct prompt or approval via *110#
   └── Subscriber enters MoMo PIN on their mobile handset
           │
           ▼
4. RobsPay Webhook / Callback
   └── POST /trial-callback or /api/v1/payments/webhook/robspay
       Payload: { trans_id, telco_tran_id, status: 'success', amount, timestamp, payment_method, customer_name }
```

---

## 3. Webhook Authentication & Security

RobsPay callbacks are processed via `POST /trial-callback` and `POST /api/v1/payments/webhook/robspay`.
When headers are provided, signatures are verified via HMAC-SHA256 using timing-safe comparison (`CryptoUtil.verifyRobsPaySignature`).

---

## 4. Idempotency & Concurrency Safety

Webhooks may be delivered multiple times by RobsPay due to network retries.

### Idempotency Protection Flow:
1. `PaymentService.handleWebhook` queries `provider_webhook_events` for `(reference, eventType, isProcessed: true)`.
2. If already processed, it immediately logs `(idempotent skip)` and returns `200 OK` without re-executing any ledger entries or state transitions.
3. If not processed, it wraps the entire status transition and double-entry ledger creation inside an atomic `AppDataSource.transaction`:
   - Updates `payment_attempts.status = 'SUCCESSFUL'`.
   - Updates `contributions.status = 'CONFIRMED'`.
   - Updates `contributors.name` if `customer_name` is returned by RobsPay.
   - Inserts `provider_transactions` record.
   - Inserts double-entry records in `financial_ledger_entries`.
   - Sets `provider_webhook_events.isProcessed = true`.

---

## 5. Refunds Integration

When an authorized user requests and approves a refund:
1. `RefundService.processRefund` invokes `robspayProvider.initiateRefund({ transactionReference, amount, merchantNote })`.
2. Marks `refunds.status = 'COMPLETED'`.
3. Updates financial ledger: Debit `2000_CONTRIBUTIONS_PAYABLE`, Credit `1000_CASH_CLEARING`.
4. Transitions contribution to `PARTIALLY_REFUNDED` or `REFUNDED`.

