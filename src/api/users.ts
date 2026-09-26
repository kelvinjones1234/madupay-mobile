import { apiClient } from "./client";
import { User } from "../types/auth";
import { API_ENDPOINTS } from "../constants/config";

/**
 * Fetch authenticated customer profile, verification status, and security metadata.
 */
export async function fetchUserProfileApi() {
  return await apiClient<User>(API_ENDPOINTS.USERS.ME, {
    method: "GET",
  });
}

/**
 * Update authenticated customer profile information (full name, phone number).
 */
export async function updateUserProfileApi(data: { fullName?: string; phone?: string }) {
  return await apiClient<User>(API_ENDPOINTS.USERS.ME, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
