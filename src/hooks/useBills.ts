import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCatalogApi, purchaseBillApi } from "../api/bills";
import { BillPurchaseParams } from "../types/bills";

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await fetchCatalogApi();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load catalog");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePurchaseBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BillPurchaseParams) => {
      const res = await purchaseBillApi(params);
      if (!res.success) {
        throw new Error(res.error || "Bill purchase failed");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate wallet and transactions queries upon successful purchase
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
