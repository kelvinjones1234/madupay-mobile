# MaduPay Mobile Client

Production-ready Expo React Native application for MaduPay customers.

## Technology Stack

- **Framework**: Expo (SDK 52) & React Native (0.76)
- **Language**: TypeScript (Strict mode)
- **Routing**: Expo Router (v4, file-based navigation)
- **Data Fetching**: `@tanstack/react-query` (v5)
- **State Management**: Zustand (v5)
- **Styling**: NativeWind (v4 / Tailwind CSS)
- **Validation**: Zod (v3)
- **Storage**: `expo-secure-store` (hardware-backed keystore)

---

## Directory Architecture

```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx         # Auth stack navigator
│   │   ├── welcome.tsx         # Onboarding landing screen
│   │   ├── login.tsx           # Customer sign-in screen
│   │   └── register.tsx        # Customer account creation
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab navigation (Home, Wallet, Bills, History, Profile)
│   │   ├── index.tsx           # Home screen (balance card, quick actions, recent transactions)
│   │   ├── wallet.tsx          # Dedicated wallet overview, bank transfer info & ledger
│   │   ├── bills.tsx           # Bill payments (Airtime, Data, Electricity, Cable TV)
│   │   ├── transactions.tsx    # Transaction history, status filtering & receipts
│   │   └── profile.tsx         # User profile, KYC verification tier, security & logout
│   └── _layout.tsx             # Root layout with QueryClientProvider and auth guard
├── src/
│   ├── api/
│   │   ├── client.ts           # Axios-like fetch client, Bearer injection & RTR 401 refresh
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── wallet.ts           # Wallet balance and transactions endpoints
│   │   ├── bills.ts            # Catalog and bill purchase endpoints
│   │   └── transactions.ts     # Customer transaction history endpoints
│   ├── components/             # Reusable UI primitives (Button, Input, Card, Header, ScreenWrapper)
│   ├── hooks/                  # React Query hooks (useAuth, useWallet, useBills, useTransactions)
│   ├── store/                  # Zustand global stores (authStore)
│   ├── types/                  # TypeScript interface definitions
│   └── utils/                  # SecureStore wrapper, NGN currency formatters, Zod schemas
└── app.json                    # Expo application manifest
```

---

## Getting Started

### 1. Backend Server
Ensure the MaduPay backend is running on `http://localhost:3000`:
```bash
npm run dev
```

### 2. Environment Configuration
The mobile app defaults to:
- **Android Emulator**: `http://10.0.2.2:3000/api/v1`
- **iOS Simulator / Web**: `http://localhost:3000/api/v1`
- **Physical Device**: Set `EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:3000/api/v1` in `mobile/.env`

### 3. Run Development Server
```bash
cd mobile
npm start
```
- Press `a` to open on Android.
- Press `i` to open on iOS simulator.
- Press `w` to open on Web.
# madupay-mobile
