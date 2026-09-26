export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  status: string;
  kycTier: number;
  verificationStatus?: string;
  security?: {
    hasPin: boolean;
    hasPassword: boolean;
    sessionVersion: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}
