import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseBillApi } from "../api/bills";
import { BillPurchaseResponse } from "../types/bills";

export interface ElectricityPurchaseParams {
  provider: string;
  meterNumber: string;
  meterType: "PREPAID" | "POSTPAID";
  amount: number;
  pin?: string;
}

export function useElectricity() {
  const queryClient = useQueryClient();

  return useMutation<BillPurchaseResponse, Error, ElectricityPurchaseParams>({
    mutationFn: async (params: ElectricityPurchaseParams) => {
      const res = await purchaseBillApi({
        serviceType: "ELECTRICITY",
        provider: params.provider,
        phoneNumber: undefined,
        recipient: params.meterNumber,
        meterType: params.meterType,
        amount: params.amount,
        pin: params.pin,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Electricity bill payment failed");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
