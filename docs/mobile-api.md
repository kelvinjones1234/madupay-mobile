# MaduPay Mobile API Documentation (v1)

This document provides the reference specification for the customer-facing Mobile REST API designed for the MaduPay Expo (React Native) mobile application.

---

## 1. Overview & Architecture

### Base URL
```
Development: http://localhost:3000/api/v1 (or LAN IP: http://192.168.x.x:3000/api/v1)
Production:  https://app.madupay.com/api/v1
```

### Standard Response Envelope
All API endpoints return JSON conforming to this consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional contextual human-readable message"
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": "Descriptive error message",
  "message": "Optional secondary description"
}
```

### HTTP Status Codes
| Status | Meaning |
| :--- | :--- |
| `200 OK` | Request succeeded. |
| `201 Created` | Resource created successfully (e.g., registration). |
| `204 No Content` | CORS preflight succeeded. |
| `400 Bad Request` | Validation failure or malformed payload. |
| `401 Unauthorized` | Missing, invalid, or expired Bearer token. |
| `402 Payment Required`| Insufficient wallet balance for bill purchase. |
| `403 Forbidden` | Account suspended or access denied. |
| `404 Not Found` | Resource not found or not owned by authenticated user. |
| `409 Conflict` | Unique constraint violation (e.g. duplicate email). |
| `429 Too Many Requests`| Account temporarily rate-limited or locked out. |
| `500 Server Error` | Unhandled internal exception. |

### Authentication Model
Protected endpoints require an `Authorization` header containing an active JWT Bearer token:
```http
Authorization: Bearer <accessToken>
```

- **Access Token Life**: 1 hour (`1h`)
- **Refresh Token Life**: 30 days (`30d`)
- **Refresh Mechanism**: Refresh Token Rotation (RTR) via `POST /api/v1/auth/refresh`
- **Revocation**: Supported via database token deletion and `User.sessionVersion` invalidation.

---

## 2. Authentication API (`/api/v1/auth`)

### 2.1 Customer Login
Authenticate using email and password to receive an access token and refresh token.

- **Endpoint**: `POST /api/v1/auth/login`
- **Auth Required**: No (Public)
- **Rate Limited**: Yes (Brute-force lockout protection)

#### Request Body
```json
{
  "email": "customer@example.com",
  "password": "mySecurePassword123",
  "deviceId": "optional-device-uuid"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": "cuid-user-id",
      "email": "customer@example.com",
      "fullName": "Jane Doe",
      "phone": "08012345678",
      "role": "USER",
      "status": "active",
      "kycTier": 1
    }
  }
}
```

#### Error Cases
- `400 Bad Request`: Missing email or password, or account registered via Google OAuth.
- `401 Unauthorized`: Invalid credentials (`Invalid email or password`).
- `403 Forbidden`: Account is suspended (`Account has been suspended. Please contact support.`).
- `429 Too Many Requests`: Account temporarily locked due to too many failed attempts.

---

### 2.2 Customer Registration
Create a new customer account and initialize a zero-balance wallet. Automatically returns tokens for seamless mobile onboarding.

- **Endpoint**: `POST /api/v1/auth/register`
- **Auth Required**: No (Public)

#### Request Body
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "08012345678",
  "password": "mySecurePassword123"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": "cuid-user-id",
      "email": "jane@example.com",
      "fullName": "Jane Doe",
      "phone": "08012345678",
      "role": "USER",
      "status": "active",
      "kycTier": 1
    }
  },
  "message": "Account created successfully"
}
```

#### Error Cases
- `400 Bad Request`: Missing fields, invalid email format, or password less than 8 characters.
- `409 Conflict`: `An account with this email already exists`.

---

### 2.3 Token Refresh (Rotation)
Exchange an active refresh token for a brand-new token pair. The old refresh token is immediately revoked upon use.

- **Endpoint**: `POST /api/v1/auth/refresh`
- **Auth Required**: No (Validated via refresh token payload)

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...new-access-token",
    "refreshToken": "eyJhbGciOi...new-refresh-token"
  }
}
```

#### Error Cases
- `400 Bad Request`: Missing refresh token.
- `401 Unauthorized`: Expired, malformed, or revoked refresh token, or session version mismatch.
- `403 Forbidden`: Account has been suspended.

---

### 2.4 Customer Logout
Revoke the provided refresh token or invalidate all sessions across devices.

- **Endpoint**: `POST /api/v1/auth/logout`
- **Auth Required**: Optional / Recommended Bearer Token

#### Request Body (Optional)
```json
{
  "refreshToken": "eyJhbGciOi...",
  "allDevices": false
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "revoked": true
  },
  "message": "Logged out successfully"
}
```

---

### 2.5 Active Session Verification
Validate the current Bearer token and retrieve the user context.

- **Endpoint**: `GET /api/v1/auth/session`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cuid-user-id",
      "email": "customer@example.com",
      "fullName": "Jane Doe",
      "phone": "08012345678",
      "role": "USER",
      "status": "active",
      "kycTier": 1,
      "sessionVersion": 1
    }
  }
}
```

---

## 3. Users API (`/api/v1/users`)

### 3.1 Get Current User Profile
Retrieve full customer details, KYC verification tier, and mobile-relevant security settings.

- **Endpoint**: `GET /api/v1/users/me`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "cuid-user-id",
    "email": "customer@example.com",
    "fullName": "Jane Doe",
    "phone": "08012345678",
    "role": "USER",
    "status": "active",
    "kycTier": 1,
    "verificationStatus": "Tier 1",
    "security": {
      "hasPin": true,
      "hasPassword": true,
      "sessionVersion": 1
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-03-01T12:00:00.000Z"
  }
}
```

---

### 3.2 Update User Profile
Update customer full name or phone number.

- **Endpoint**: `PATCH /api/v1/users/me`
- **Auth Required**: Yes (`Bearer <token>`)

#### Request Body
```json
{
  "fullName": "Jane Updated Doe",
  "phone": "08099887766"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "cuid-user-id",
    "fullName": "Jane Updated Doe",
    "phone": "08099887766",
    ...
  },
  "message": "Profile updated successfully"
}
```

#### Error Cases
- `400 Bad Request`: Full name invalid length (<2 or >100 characters), phone number not 11 digits, or phone already registered to another account.

---

## 4. Wallet API (`/api/v1/wallet`)

### 4.1 Get Wallet Summary
Retrieve current account balance, safe-to-spend balance, locked allocation, and limits.

- **Endpoint**: `GET /api/v1/wallet`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "balance": 25000.00,
    "safeToSpend": 20000.00,
    "locked": 5000.00,
    "dailyLimit": 50000.00,
    "monthlyLimit": 250000.00,
    "currency": "NGN",
    "status": "active"
  }
}
```

---

### 4.2 Get Wallet Transaction History
Retrieve wallet balance movements with cursor pagination and date/type/status filtering.

- **Endpoint**: `GET /api/v1/wallet/transactions`
- **Auth Required**: Yes (`Bearer <token>`)
- **Query Parameters**:
  - `limit`: Integer (1-100, default: 20)
  - `cursor`: String (Transaction ID for next page)
  - `type`: String (`AIRTIME`, `DATA`, `CABLE`, `ELECTRICITY`, `EPIN`, `FUNDING`)
  - `status`: String (`SUCCESSFUL`, `FAILED`, `PENDING`)
  - `startDate`: ISO 8601 Date string (e.g. `2026-03-01`)
  - `endDate`: ISO 8601 Date string (e.g. `2026-03-31`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_123",
        "reference": "TXN-20260326-XYZ",
        "providerRef": "PROV-999",
        "type": "DATA",
        "amount": 1000.00,
        "recipient": "08012345678",
        "status": "SUCCESSFUL",
        "serviceId": "mtn-1gb",
        "createdAt": "2026-03-26T12:00:00.000Z"
      }
    ],
    "nextCursor": "tx_123",
    "hasMore": false
  }
}
```

---

## 5. Catalog API (`/api/v1/catalog`)

### 5.1 Get Mobile Catalog Options
Returns all available purchase options: airtime telcos and discounts, data bundles, electricity DisCos, cable TV bouquets, and e-pin products.

- **Endpoint**: `GET /api/v1/catalog`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "supportedServices": ["AIRTIME", "DATA", "CABLE", "ELECTRICITY", "EPIN"],
    "airtime": {
      "providers": ["MTN", "AIRTEL", "GLO", "9MOBILE"],
      "discounts": [
        { "network": "MTN", "discount": 2.5 }
      ]
    },
    "data": {
      "providers": ["MTN", "AIRTEL", "GLO", "9MOBILE"],
      "plans": [
        {
          "id": "data_plan_1",
          "network": "MTN",
          "name": "1.5GB Monthly",
          "duration": "30 days",
          "sellingPrice": 1200
        }
      ]
    },
    "cable": {
      "providers": ["DSTV", "GOTV", "STARTIMES", "SHOWMAX"],
      "plans": [
        {
          "id": "dstv_compact",
          "network": "DSTV",
          "name": "DStv Compact",
          "sellingPrice": 15700
        }
      ]
    },
    "electricity": {
      "providers": ["IKEDC", "EKEDC", "IBEDC", "AEDC", "EEDC", "PHED", "KEDCO", "KAEDCO", "BEDC", "YEDC", "ABA"]
    },
    "epin": {
      "exams": ["WAEC", "NECO", "NABTEB", "JAMB"]
    }
  },
  "message": "Catalog retrieved successfully"
}
```

---

## 6. Bills API (`/api/v1/bills`)

### 6.1 Purchase Bill / Airtime / Data / Electricity / Cable / E-Pin
Executes a financial bill purchase through the existing MaduPay billing orchestrator, atomic wallet debit settlement, and vendor dispatch strategies with idempotency protection.

- **Endpoint**: `POST /api/v1/bills/purchase`
- **Auth Required**: Yes (`Bearer <token>`)

#### Request Body
```json
{
  "serviceType": "DATA",
  "provider": "MTN",
  "phoneNumber": "08012345678",
  "planId": "data_plan_1",
  "pin": "1234",
  "idempotencyKey": "a98fd76-uuid-v4"
}
```

#### Field Specifications
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `serviceType` | `string` | **Yes** | `AIRTIME`, `DATA`, `CABLE`, `ELECTRICITY`, or `EPIN` |
| `provider` | `string` | **Yes** | Telco (`MTN`), Operator (`DSTV`), DisCo (`IKEDC`), or Exam (`WAEC`) |
| `amount` | `number` | Required for Airtime & Electricity | Top-up or recharge amount in NGN |
| `phoneNumber` | `string` | Required for Airtime & Data | 11-digit phone number |
| `recipient` | `string` | Alternative for Meter/Smartcard | Smartcard or meter number |
| `planId` | `string` | Required for Data & Cable | Bundle or package product ID |
| `meterType` | `string` | Optional for Electricity | `PREPAID` (default) or `POSTPAID` |
| `quantity` | `number` | Optional for E-Pin | Number of tokens (1-20, default: 1) |
| `pin` | `string` | Optional | Transaction PIN if configured on user profile |
| `idempotencyKey` | `string` | **Recommended** | Unique UUID to guarantee zero duplicate charges |

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "success": true,
    "transactionId": "tx_cuid",
    "reference": "TXN-20260326-ABC",
    "amount": 1200.00,
    "status": "SUCCESSFUL"
  },
  "message": "Bill purchase processed successfully"
}
```

#### Error Cases
- `400 Bad Request`: Validation failure (e.g. invalid phone number, invalid meter length, unknown provider).
- `401 Unauthorized`: Missing or invalid Bearer token, or incorrect transaction PIN.
- `402 Payment Required`: Insufficient wallet balance to cover the bill amount.

---

## 7. Transactions API (`/api/v1/transactions`)

### 7.1 List User Transactions
Query user transaction history with pagination and status/type/date filtering.

- **Endpoint**: `GET /api/v1/transactions`
- **Auth Required**: Yes (`Bearer <token>`)
- **Query Parameters**: Same as `/api/v1/wallet/transactions` (`limit`, `cursor`, `type`, `status`, `startDate`, `endDate`).

---

### 7.2 Get Transaction Details & Receipt
Retrieve granular details of an individual transaction including vendor reference, status, and generated receipt information.

- **Endpoint**: `GET /api/v1/transactions/:id`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "tx_123",
    "reference": "TXN-20260326-XYZ",
    "providerRef": "VTU-9988",
    "type": "ELECTRICITY",
    "amount": 5000.00,
    "recipient": "12345678901",
    "status": "SUCCESSFUL",
    "serviceId": "ikedc",
    "createdAt": "2026-03-26T14:30:00.000Z",
    "metaData": {
      "token": "4567-8901-2345-6789-0123",
      "units": "85.2 kWh"
    },
    "receipt": {
      "receiptNo": "RCP-20260326-0001",
      "status": "GENERATED",
      "createdAt": "2026-03-26T14:30:05.000Z"
    }
  }
}
```

#### Error Cases
- `404 Not Found`: Transaction does not exist or belongs to another user (unauthorized access prevention).

---

## 8. Notifications API (`/api/v1/notifications`)

### 8.1 List Notifications & Unread Count
Retrieve cursor-paginated notification feed and unread badge count.

- **Endpoint**: `GET /api/v1/notifications`
- **Auth Required**: Yes (`Bearer <token>`)
- **Query Parameters**:
  - `cursor`: String (Optional notification ID for next page)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_1",
        "title": "Wallet Funded",
        "message": "Your wallet was credited with ₦10,000.00 via bank transfer.",
        "isRead": false,
        "createdAt": "2026-03-26T15:00:00.000Z"
      }
    ],
    "unreadCount": 1,
    "nextCursor": null,
    "hasMore": false
  }
}
```

---

### 8.2 Mark Notification As Read
Mark a specific notification as read.

- **Endpoint**: `PATCH /api/v1/notifications/:id`
- **Auth Required**: Yes (`Bearer <token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "notif_1",
    "isRead": true
  },
  "message": "Notification marked as read"
}
```
