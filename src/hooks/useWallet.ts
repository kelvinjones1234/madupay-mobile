import { useQuery } from "@tanstack/react-query";
import { fetchWalletSummaryApi, fetchWalletTransactionsApi, WalletTransactionsParams } from "../api/wallet";

export function useWalletSummary() {
  return useQuery({
    queryKey: ["wallet", "summary"],
    queryFn: async () => {
      const res = await fetchWalletSummaryApi();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load wallet summary");
      }
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useWalletTransactions(params: WalletTransactionsParams = {}) {
  return useQuery({
    queryKey: ["wallet", "transactions", params],
    queryFn: async () => {
      const res = await fetchWalletTransactionsApi(params);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load wallet transactions");
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}
