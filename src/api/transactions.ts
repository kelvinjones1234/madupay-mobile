import { apiClient } from "./client";
import { TransactionDetail, TransactionsListResponse } from "../types/transactions";

export interface TransactionsQueryOptions {
  limit?: number;
  cursor?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchTransactionsApi(options: TransactionsQueryOptions = {}) {
  const query = new URLSearchParams();
  if (options.limit) query.append("limit", options.limit.toString());
  if (options.cursor) query.append("cursor", options.cursor);
  if (options.type) query.append("type", options.type);
  if (options.status) query.append("status", options.status);
  if (options.startDate) query.append("startDate", options.startDate);
  if (options.endDate) query.append("endDate", options.endDate);

  const qs = query.toString();
  return await apiClient<TransactionsListResponse>(`/transactions${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export async function fetchTransactionDetailApi(id: string) {
  return await apiClient<TransactionDetail>(`/transactions/${id}`, {
    method: "GET",
  });
}
