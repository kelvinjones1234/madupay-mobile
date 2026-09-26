import { apiClient } from "./client";
import { LoginResponseData, RegisterResponseData, User } from "../types/auth";
import { LoginFormData } from "../utils/validation";
import { API_ENDPOINTS } from "../constants/config";

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export async function loginApi(credentials: LoginFormData) {
  return await apiClient<LoginResponseData>(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerApi(data: RegisterPayload) {
  return await apiClient<RegisterResponseData>(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutApi(refreshToken?: string) {
  return await apiClient<{ revoked: boolean }>(API_ENDPOINTS.AUTH.LOGOUT, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function fetchSessionApi() {
  return await apiClient<{ user: User }>(API_ENDPOINTS.AUTH.SESSION, {
    method: "GET",
  });
}

// Re-export profile endpoints from users.ts for convenience
export { fetchUserProfileApi as fetchProfileApi, updateUserProfileApi as updateProfileApi } from "./users";
