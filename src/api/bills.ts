import { apiClient } from "./client";
import { CatalogData, BillPurchaseParams, BillPurchaseResponse } from "../types/bills";

export async function fetchCatalogApi() {
  return await apiClient<CatalogData>("/catalog", {
    method: "GET",
  });
}

export async function purchaseBillApi(params: BillPurchaseParams) {
  return await apiClient<BillPurchaseResponse>("/bills/purchase", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
