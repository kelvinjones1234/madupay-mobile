import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotificationsApi, markNotificationAsReadApi } from "../api/notifications";
import { NotificationsResponse } from "../types/notifications";

export function useNotifications(cursor?: string) {
  return useQuery<NotificationsResponse, Error>({
    queryKey: ["notifications", cursor],
    queryFn: async () => {
      const res = await fetchNotificationsApi(cursor);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to load notifications");
      }
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await markNotificationAsReadApi(id);
      if (!res.success) {
        throw new Error(res.error || "Failed to mark notification as read");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
