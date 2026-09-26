import { apiClient } from "./client";
import {
  WalletSummary,
  WalletTransactionsResponse,
  FundWalletParams,
  FundWalletResponse,
} from "../types/wallet";

export interface WalletTransactionsParams {
  limit?: number;
  cursor?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function fetchWalletSummaryApi() {
  return await apiClient<WalletSummary>("/wallet", {
    method: "GET",
  });
}

export async function fetchWalletTransactionsApi(params: WalletTransactionsParams = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.cursor) query.append("cursor", params.cursor);
  if (params.type) query.append("type", params.type);
  if (params.status) query.append("status", params.status);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);

  const qs = query.toString();
  return await apiClient<WalletTransactionsResponse>(`/wallet/transactions${qs ? `?${qs}` : ""}`, {
    method: "GET",
  });
}

export async function fundWalletApi(params: FundWalletParams) {
  return await apiClient<FundWalletResponse>("/wallet/fund", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
