/**
 * MaduPay Mobile Configuration Constants
 */
export const APP_CONFIG = {
  name: "MaduPay",
  version: "1.0.0",
  tagline: "Fast, Reliable Payments & Virtual Wallets",
  supportEmail: "support@madupay.com",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "madupay_mobile_access_token",
  REFRESH_TOKEN: "madupay_mobile_refresh_token",
  USER_DATA: "madupay_mobile_user_data",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    SESSION: "/auth/session",
  },
  USERS: {
    ME: "/users/me",
  },
  WALLET: {
    SUMMARY: "/wallet",
    TRANSACTIONS: "/wallet/transactions",
  },
  CATALOG: {
    INDEX: "/catalog",
  },
  BILLS: {
    PURCHASE: "/bills/purchase",
  },
  TRANSACTIONS: {
    LIST: "/transactions",
    DETAIL: (id: string) => `/transactions/${id}`,
  },
} as const;
