import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsApi, fetchTransactionDetailApi, TransactionsQueryOptions } from "../api/transactions";

export function useTransactions(options: TransactionsQueryOptions = {}) {
  return useQuery({
    queryKey: ["transactions", "list", options],
    queryFn: async () => {
      const res = await fetchTransactionsApi(options);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load transactions");
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export function useTransactionDetail(id: string) {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: async () => {
      const res = await fetchTransactionDetailApi(id);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Transaction not found");
      }
      return res.data;
    },
    enabled: !!id,
  });
}
