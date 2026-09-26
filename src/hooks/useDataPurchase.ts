import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseBillApi } from "../api/bills";
import { BillPurchaseResponse } from "../types/bills";

export interface DataPurchaseParams {
  provider: string;
  phoneNumber: string;
  planId: string;
  amount: number;
  pin?: string;
}

export function useDataPurchase() {
  const queryClient = useQueryClient();

  return useMutation<BillPurchaseResponse, Error, DataPurchaseParams>({
    mutationFn: async (params: DataPurchaseParams) => {
      const res = await purchaseBillApi({
        serviceType: "DATA",
        provider: params.provider,
        phoneNumber: params.phoneNumber,
        recipient: params.phoneNumber,
        planId: params.planId,
        amount: params.amount,
        pin: params.pin,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Data bundle purchase failed");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
