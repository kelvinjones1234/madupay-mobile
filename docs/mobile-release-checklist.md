# MaduPay Mobile Production Release Checklist & Security Audit

This document outlines the production readiness criteria, security audit findings, device permission justifications, and store release checklist for **MaduPay Mobile** (iOS & Android).

---

## 1. Product Boundaries & Architecture Summary

MaduPay Mobile is strictly a **customer-facing fintech client**.

- **No Admin Capabilities**: Provider switching, health monitoring, system controls, and administrative actions exist exclusively in the web application and are inaccessible via mobile endpoints.
- **Unified Mobile Gateway**: All transactions communicate through `Mobile App` $\rightarrow$ `Backend /api/v1` $\rightarrow$ `Billing Orchestrator / Settlement` $\rightarrow$ `Upstream Providers & DB`.
- **Zero Client Settlement**: The mobile client never processes payments directly; all financial logic executes within atomic Prisma transactions with database-level wallet locking.

---

## 2. Store Submission Checklist

### A. iOS App Store

- [ ] **Bundle Identifier**: `com.madupay.mobile`
- [ ] **App Category**: Financial Services / Finance
- [ ] **Content Rating**: 4+ (Financial transactions, no mature content)
- [ ] **Privacy Nutrition Label (App Privacy)**:
  - **Financial Info**: Payment info (processed through Paystack/Monnify SDKs/APIs).
  - **Contact Info**: Name, email address, phone number (used for authentication & transaction receipt SMS/email).
  - **Identifiers**: User ID, Device ID (used for session tracking and push notification delivery).
  - **Data Linked to You**: Yes, linked to user account.
  - **Third-Party Tracking**: No user tracking or ad brokers.
- [ ] **Apple Review Demo Account**:
  - Test credentials with pre-funded wallet balance for App Store Review team testing.
- [ ] **Info.plist Justifications**:
  - `NSFaceIDUsageDescription`: "Use Face ID to quickly and securely authenticate to your MaduPay account."

### B. Google Play Store

- [ ] **Package Name**: `com.madupay.mobile`
- [ ] **App Category**: Finance
- [ ] **Content Rating**: Everyone / IARC Certified
- [ ] **Target SDK**: Android 14 (API level 34+)
- [ ] **Target Architecture**: Android App Bundle (`.aab`) with 64-bit support
- [ ] **Data Safety Section**:
  - Encrypted in transit (HTTPS / TLS 1.3).
  - Account deletion request mechanism accessible in profile/settings.
  - Financial data collected exclusively for payment processing and fraud prevention.
- [ ] **Permissions Declared**:
  - `USE_BIOMETRIC`: Fast app unlock and payment verification.
  - `USE_FINGERPRINT`: Legacy biometric fallback for older Android devices.
  - `VIBRATE`: Haptic feedback on payment confirmation and scanner actions.
  - `RECEIVE_BOOT_COMPLETED`: Reschedule background push notification listeners upon device reboot.

---

## 3. Security Audit & Hardening Matrix

| Security Area | Implementation in MaduPay Mobile | Verification Status |
| :--- | :--- | :--- |
| **Token Storage** | `expo-secure-store` using iOS Keychain and Android KeyStore with AES-256 GCM encryption. No tokens stored in unencrypted `AsyncStorage`. | Verified |
| **Token Rotation** | Dual-token authentication (short-lived JWT access token + secure refresh token) with automatic interceptor-based renewal and retry queue. | Verified |
| **Session Invalidation** | Server-side session version tracking. Global logout invalidates refresh token and increments user session version. | Verified |
| **Idempotency** | Bill purchases and wallet funding generate unique idempotency keys to eliminate double-billing risks. | Verified |
| **Balance Safeguards** | Client strictly checks `safeToSpend` before opening confirmation review, preventing overdrafts or locked envelope fund misuse. | Verified |
| **Crash Protection** | Global React `ErrorBoundary` and dedicated `NetworkError` view prevent native white screens and maintain wallet integrity. | Verified |
| **Input Sanitization** | Phone numbers, meter numbers, and smartcard IUCs sanitized using regex before payload dispatch. | Verified |
| **Account Validation** | Customer smartcard and meter number validation enforced prior to bill vending. | Verified |

---

## 4. Build Profiles & EAS Configuration

The `eas.json` configuration provides three deployment channels:

```bash
# 1. Internal Development Client
eas build --profile development --platform all

# 2. QA / Internal TestFlight / APK Preview
eas build --profile preview --platform all

# 3. Store Production Release (App Store / Google Play .aab)
eas build --profile production --platform all
```

### Environment Variables

| Variable | Development | Preview (Staging) | Production |
| :--- | :--- | :--- | :--- |
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000/api/v1` | `https://staging.madupay.com/api/v1` | `https://api.madupay.com/api/v1` |
| `EXPO_PUBLIC_APP_ENV` | `development` | `staging` | `production` |

---

## 5. Pre-Release Smoke Test Plan

1. **Authentication**: Register new account $\rightarrow$ Receive tokens $\rightarrow$ Log out $\rightarrow$ Log in with biometrics $\rightarrow$ Session restored.
2. **Wallet Funding**: Select Bank Transfer $\rightarrow$ Verify virtual account details $\rightarrow$ Select Card $\rightarrow$ Receive Paystack checkout URL.
3. **Airtime**: Select Telco provider $\rightarrow$ Input recipient phone $\rightarrow$ Validate phone $\rightarrow$ Confirm purchase $\rightarrow$ Verify receipt.
4. **Data Bundles**: Select Telco $\rightarrow$ Pick bundle plan $\rightarrow$ Confirm purchase $\rightarrow$ Verify balance decrement.
5. **Electricity Tokens**: Select DisCo $\rightarrow$ Input meter $\rightarrow$ Validate customer name $\rightarrow$ Confirm purchase $\rightarrow$ Verify generated token display and copy action.
6. **Cable TV**: Select Provider $\rightarrow$ Enter smartcard $\rightarrow$ Validate customer account $\rightarrow$ Select bouquet $\rightarrow$ Confirm renewal.
7. **Receipts & History**: Open transaction history $\rightarrow$ Tap item $\rightarrow$ Open receipt screen $\rightarrow$ Verify share dialog and reference copy.
8. **Notifications**: Send test notification $\rightarrow$ Verify push delivery and unread count badge $\rightarrow$ Tap to mark as read.
