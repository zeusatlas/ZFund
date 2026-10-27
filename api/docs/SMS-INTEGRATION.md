# SMS & Notification System Integration Guide

This document describes the multi-provider SMS architecture, concrete adapters, database-driven templates, failure resilience, and delivery tracking.

---

## 1. Provider Abstraction: `ISmsProvider`

SMS integration is fully abstracted to decouple messaging operations from telecom vendors:

```typescript
export interface SendSmsParams {
  notificationId?: string;
  recipient: string;
  message: string;
  senderId?: string;
}

export interface SendSmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
  rawResponse?: Record<string, unknown>;
}

export interface ISmsProvider {
  readonly code: string;
  send(params: SendSmsParams): Promise<SendSmsResult>;
}
```

### 1.1 Available Adapters
1. **`MockSmsAdapter`:** In-memory mock adapter used in development and automated testing. Logs messages to Pino structured logger and simulates instant delivery without external network calls.
2. **`ArkeselSmsAdapter`:** Production adapter for Arkesel (leading telecom SMS gateway in Ghana). Integrates via HTTP POST with API key authentication, supports sender IDs (e.g. `ZFUND`), and normalizes carrier responses.
3. **`SmsProviderFactory`:** Dynamically resolves the active adapter on startup based on the `SMS_PROVIDER` environment variable (`mock`, `arkesel`, `nalo`).

---

## 2. Non-Blocking Delivery & Financial Resilience

> **Critical Architectural Rule:**
> **An SMS delivery failure must NEVER cause a confirmed financial transaction to fail or roll back.**

When a payment succeeds or a refund completes:
1. The database transaction committing the payment and ledger entries finishes **first**.
2. The `NotificationService.sendNotification` method creates a `Notification` record with status `QUEUED`.
3. SMS dispatch occurs asynchronously in a fire-and-forget background task.
4. If the telecom provider rejects the message or encounters a network error, the error is recorded in `notification_delivery_attempts`, and the notification status is set to `FAILED`.
5. The confirmed payment remains 100% successful.

---

## 3. Database-Driven Notification Templates

Message content is not hardcoded in source files. Administrators configure templates in `notification_templates`:

| Template Key | Event Type | Message Body Sample |
|---|---|---|
| `PAYMENT_CONFIRMED_CONTRIBUTOR` | `PAYMENT_CONFIRMED` | `Thank you! Your contribution of {currency} {amount} to {projectName} has been received. Ref: {reference}.` |
| `REFUND_COMPLETED_CONTRIBUTOR` | `REFUND_COMPLETED` | `Your refund of {currency} {amount} for {projectName} has been processed. Ref: {reference}.` |
| `PROJECT_PUBLISHED_OWNER` | `PROJECT_PUBLISHED` | `Congratulations! Your project {projectName} is now live with USSD dial code: *920*969*{eventCode}#.` |

### Safe Placeholder Replacement
Template variables are rendered safely using exact key interpolation (`{key}`). Arbitrary code evaluation (`eval`, template scripts) is strictly prevented.

---

## 4. Protected Administrative Connectivity Testing

To verify SMS gateway connectivity without writing custom scripts, authorized platform staff can trigger a test message:

- **Endpoint:** `POST /api/v1/notifications/test-sms`
- **Authorization:** `requireRole(SystemRole.SUPER_ADMIN, SystemRole.PLATFORM_ADMIN)`
- **Request Body:**
  ```json
  {
    "recipient": "233240000001",
    "message": "ZFund SMS connectivity test message"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Test SMS dispatched successfully",
    "data": {
      "provider": "ARKESEL",
      "messageId": "ark_msg_897123"
    }
  }
  ```
