import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseBillApi } from "../api/bills";
import { BillPurchaseResponse } from "../types/bills";

export interface CablePurchaseParams {
  provider: string;
  smartcardNumber: string;
  planId: string;
  amount?: number;
  pin?: string;
}

export function useCable() {
  const queryClient = useQueryClient();

  return useMutation<BillPurchaseResponse, Error, CablePurchaseParams>({
    mutationFn: async (params: CablePurchaseParams) => {
      const res = await purchaseBillApi({
        serviceType: "CABLE",
        provider: params.provider,
        phoneNumber: params.smartcardNumber,
        recipient: params.smartcardNumber,
        planId: params.planId,
        amount: params.amount,
        pin: params.pin,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Cable TV subscription failed");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
