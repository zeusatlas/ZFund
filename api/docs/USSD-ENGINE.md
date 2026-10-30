# Database-Driven USSD Engine

This document explains the architecture, data model, execution lifecycle, action registry, and publication mechanics of the **ZFund USSD Engine**.

---

## 1. Core Principle: Zero Hardcoded Menus

**USSD menus, options, prompts, and transitions are never hardcoded in TypeScript source code.**

All menu text, numeric options, validation rules, navigation flows, and project-specific paths are stored in PostgreSQL and interpreted dynamically at runtime by `UssdRuntimeService`.

> **Proven by Automated Integration Test:**
> Updating a menu prompt or adding a menu option in the database immediately alters the USSD prompt delivered to mobile subscribers without restarting the server or deploying new code.

---

## 2. USSD Flow Data Model

The USSD engine is modeled around 4 key relational entities:

```
[ Project ] ──1:1──> [ UssdFlow ] ──1:N──> [ UssdFlowVersion ]
                                                    │
                                            1:N ────┴──── 1:N
                                            ▼              ▼
                                      [ UssdMenu ] ──1:N──> [ UssdMenuOption ]
```

1. **`UssdFlow`:** Represents the flow identity (General root flow or Project-specific flow).
2. **`UssdFlowVersion`:** Immutable snapshot of flow configuration. Versions maintain statuses:
   - `DRAFT`: Active workspace for administrators configuring menus.
   - `PUBLISHED`: The live version evaluated by runtime traffic.
   - `ARCHIVED`: Historical snapshot.
3. **`UssdMenu`:** A single screen presented to the mobile contributor.
   - `menuKey`: Stable identifier (e.g. `WELCOME`, `SELECT_PURPOSE`, `ENTER_AMOUNT`, `CONFIRM_CONTRIBUTION`).
   - `menuType`: `STATIC_OPTIONS`, `AMOUNT_INPUT`, `CONFIRMATION`, `ACTION`, `TERMINAL`.
   - `prompt`: Text template displayed on the phone (supporting placeholders like `{projectName}`).
4. **`UssdMenuOption`:** Selectable choices on a static menu.
   - `optionKey`: User input digit (e.g. `1`, `2`, `3`, `0`).
   - `label`: Display text (e.g. `1. Offering`, `2. Tithe`, `0. Back`).
   - `targetMenuId`: Target menu to navigate to.
   - `actionKey`: Allowlisted action to execute upon selection.

---

## 3. Allowlisted Action Registry (`UssdActionRegistry`)

To prevent arbitrary code execution or unsafe dynamic evaluation, all actions triggerable from database USSD transitions must map to an **explicitly approved action handler** registered in `UssdActionRegistry`:

| Action Key | Description | Lifecycle Behavior |
|---|---|---|
| `SELECT_PURPOSE` | Contributor selects a contribution purpose | Saves `purposeId` in session state, transitions to `ENTER_AMOUNT`. |
| `VALIDATE_AMOUNT` | Validates numeric input against project min/max bounds | Formats decimal string, saves `amount` in session state, transitions to `CONFIRM_CONTRIBUTION`. |
| `INITIATE_PAYMENT` | Triggers RobsPay Mobile Money collection | Calls `PaymentService.initiatePayment`, binds payment reference, displays USSD prompt that payment prompt has been sent to phone to authorize with MoMo PIN, and terminates USSD session (`MSGTYPE: false`). |
| `CHECK_STATUS` | Queries recent payment status | Retrieves status of last payment attempt and displays confirmation. |
| `NAVIGATE_BACK` | Returns to the parent menu | Pops previous menu from session navigation stack. |
| `EXIT` | Terminates the USSD session | Returns friendly exit message and sets `MSGTYPE: false`. |

---

## 4. Multi-Turn Session State & Dual-Layer Storage

USSD is fundamentally a stateless telecom protocol over short-lived sessions (typically 20–40 seconds before network timeout). ZFund uses a dual-layer strategy:

```
[ Incoming Request ]
        │
        ├──> Fast Lookaside: Redis Cache (`zfund:ussd:session:<id>`) TTL: 3 minutes
        └──> Durable Persistence: PostgreSQL (`ussd_sessions` & `ussd_session_events`)
```

### Session State Payload
- `sessionId`: NALO provider session identifier.
- `msisdn`: Mobile subscriber phone number (string).
- `projectId`: Resolved project UUID.
- `flowVersionId`: Published flow version in use.
- `currentMenuId`: Active menu.
- `context`: Non-sensitive session data:
  ```json
  {
    "purposeId": "f7a1b2c3-...",
    "purposeName": "Building Project",
    "amount": "50.00",
    "currency": "GHS"
  }
  ```
- `history`: Menu navigation stack for seamless `0. Back` functionality.

---

## 5. NALO Message Constraints (120 Characters)

Under NALO's gateway specification, the maximum length for a single USSD screen is **120 characters**.

- The `NaloAdapter.formatResponse()` utility automatically checks message length.
- If a generated menu exceeds 120 characters, it truncates the prompt cleanly and appends `...` to guarantee the telecom provider accepts the payload without network rejection.
