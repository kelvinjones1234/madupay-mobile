import { useMutation } from "@tanstack/react-query";

export interface BillValidationParams {
  serviceType: "ELECTRICITY" | "CABLE";
  provider: string;
  customerId: string;
  meterType?: "PREPAID" | "POSTPAID";
}

export interface BillValidationResult {
  isValid: boolean;
  customerName: string;
  customerAddress?: string;
  customerId: string;
  provider: string;
}

/**
 * Hook to validate customer meter numbers or smartcard accounts before payment.
 */
export function useBillValidation() {
  return useMutation<BillValidationResult, Error, BillValidationParams>({
    mutationFn: async (params: BillValidationParams) => {
      // Simulate remote disco/cable gateway account lookup latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const cleanedId = params.customerId.trim().replace(/\s+/g, "");

      if (cleanedId.length < 8) {
        throw new Error(
          params.serviceType === "ELECTRICITY"
            ? "Invalid meter number. Please check and try again."
            : "Invalid smartcard/IUC number. Must be at least 8 digits."
        );
      }

      // Generate verified account metadata
      const isElectricity = params.serviceType === "ELECTRICITY";
      const sampleNames = [
        "CHUKWUDI EMMANUEL OBI",
        "OLUWASEUN ADEKUNLE",
        "FATIMA ABUBAKAR",
        "BLESSING OKON",
      ];
      const index = Math.abs(cleanedId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % sampleNames.length;

      return {
        isValid: true,
        customerName: sampleNames[index],
        customerAddress: isElectricity ? "Plot 14, Commercial District, Zone 4" : undefined,
        customerId: cleanedId,
        provider: params.provider,
      };
    },
  });
}
