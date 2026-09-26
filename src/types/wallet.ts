export interface VirtualAccountInfo {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface WalletSummary {
  balance: number;
  walletBalance?: number;
  safeToSpend: number;
  locked: number;
  lockedBalance?: number;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
  status: string;
  virtualAccount?: VirtualAccountInfo | null;
}

export interface WalletTransactionItem {
  id: string;
  reference: string;
  providerRef: string | null;
  type: string;
  amount: number;
  recipient: string;
  status: string;
  serviceId: string | null;
  createdAt: string;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransactionItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FundWalletParams {
  amount: number;
  paymentMethod?: "CARD" | "BANK_TRANSFER";
}

export interface FundWalletResponse {
  paymentMethod: "CARD" | "BANK_TRANSFER";
  reference?: string;
  amount: number;
  accessCode?: string;
  authorizationUrl?: string;
  virtualAccount?: VirtualAccountInfo | null;
  instructions?: string;
}
