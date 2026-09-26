import { apiClient } from "./client";
import { NotificationsResponse } from "../types/notifications";

export async function fetchNotificationsApi(cursor?: string) {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  return await apiClient<NotificationsResponse>(`/notifications${query}`, {
    method: "GET",
  });
}

export async function markNotificationAsReadApi(id: string) {
  return await apiClient<{ id: string; isRead: boolean }>(`/notifications/${id}`, {
    method: "PATCH",
  });
}
