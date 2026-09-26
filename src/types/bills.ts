export type ServiceType = "AIRTIME" | "DATA" | "CABLE" | "ELECTRICITY" | "EPIN";

export interface BillPurchaseParams {
  serviceType: ServiceType;
  provider: string;
  amount?: number;
  phoneNumber?: string;
  recipient?: string;
  planId?: string;
  meterType?: "PREPAID" | "POSTPAID";
  quantity?: number;
  pin?: string;
  idempotencyKey?: string;
}

export interface BillPurchaseResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  amount?: number;
  status?: string;
  error?: string;
  message?: string;
  token?: string | null;
  units?: string | null;
  data?: {
    reference?: string;
    receiptNo?: string;
    token?: string | null;
    units?: string | null;
    amount?: number;
    recipient?: string;
    customerName?: string;
    meterNumber?: string;
    meterType?: string;
    network?: string;
    [key: string]: unknown;
  };
}

export interface CatalogData {
  supportedServices: string[];
  airtime: {
    providers: string[];
    discounts: Array<{ network: string; discount: number }>;
  };
  data: {
    providers: string[];
    plans: Array<{
      id: string;
      network: string;
      name: string;
      duration: string;
      sellingPrice: number;
    }>;
  };
  cable: {
    providers: string[];
    plans: Array<{
      id: string;
      network: string;
      name: string;
      sellingPrice: number;
    }>;
  };
  electricity: {
    providers: string[];
  };
  epin: {
    exams: string[];
  };
}
