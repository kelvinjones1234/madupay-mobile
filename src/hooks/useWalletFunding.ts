import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fundWalletApi } from "../api/wallet";
import { FundWalletParams, FundWalletResponse } from "../types/wallet";

export function useWalletFunding() {
  const queryClient = useQueryClient();

  return useMutation<FundWalletResponse, Error, FundWalletParams>({
    mutationFn: async (params: FundWalletParams) => {
      const res = await fundWalletApi(params);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to initialize wallet funding");
      }
      return res.data;
    },
    onSuccess: () => {
      // Invalidate wallet summary and transaction queries
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
