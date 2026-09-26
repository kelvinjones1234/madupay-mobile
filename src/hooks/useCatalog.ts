import { useQuery } from "@tanstack/react-query";
import { fetchCatalogApi } from "../api/bills";
import { CatalogData } from "../types/bills";

/**
 * React Query hook to fetch and cache bill payment catalog
 * (Airtime providers, Data plans, Electricity Discos, Cable TV packages)
 */
export function useCatalog() {
  return useQuery<CatalogData, Error>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await fetchCatalogApi();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load product catalog");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
  });
}
