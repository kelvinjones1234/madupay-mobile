import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseBillApi } from "../api/bills";
import { BillPurchaseResponse } from "../types/bills";

export interface AirtimePurchaseParams {
  provider: string;
  phoneNumber: string;
  amount: number;
  pin?: string;
}

export function useAirtimePurchase() {
  const queryClient = useQueryClient();

  return useMutation<BillPurchaseResponse, Error, AirtimePurchaseParams>({
    mutationFn: async (params: AirtimePurchaseParams) => {
      const res = await purchaseBillApi({
        serviceType: "AIRTIME",
        provider: params.provider,
        phoneNumber: params.phoneNumber,
        recipient: params.phoneNumber,
        amount: params.amount,
        pin: params.pin,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Airtime purchase failed");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
