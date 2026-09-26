export interface TransactionReceipt {
  receiptNo: string;
  status: string;
  createdAt: string;
}

export interface TransactionDetail {
  id: string;
  reference: string;
  providerRef: string | null;
  type: string;
  amount: number;
  recipient: string;
  status: string;
  createdAt: string;
  serviceId: string | null;
  metaData: Record<string, unknown> | null;
  receipt: TransactionReceipt | null;
}

export interface TransactionsListResponse {
  transactions: TransactionDetail[];
  nextCursor: string | null;
  hasMore: boolean;
}
