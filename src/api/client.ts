import { Platform } from "react-native";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearAuthTokens } from "../utils/storage";
import { ApiResponse } from "../types/api";

// Determine default host based on platform
function getDefaultBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator routes host machine loopback to 10.0.2.2
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api/v1";
  }
  return "http://localhost:3000/api/v1";
}

export const API_BASE_URL = getDefaultBaseUrl();

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

/**
 * Universal API Request Client with Bearer token injection and automatic 401 Refresh Token Rotation.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized by attempting Refresh Token Rotation (RTR)
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
      if (isRefreshing) {
        // Wait for token refresh in progress
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(url, { ...options, headers });
        } catch {
          return { success: false, error: "Session expired. Please sign in again." };
        }
      } else {
        isRefreshing = true;
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          await clearAuthTokens();
          isRefreshing = false;
          return { success: false, error: "Authentication required" };
        }

        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshData = await refreshRes.json();

          if (refreshRes.ok && refreshData.success && refreshData.data?.accessToken) {
            const newAccess = refreshData.data.accessToken;
            const newRefresh = refreshData.data.refreshToken;

            await setAccessToken(newAccess);
            if (newRefresh) await setRefreshToken(newRefresh);

            processQueue(null, newAccess);
            headers.Authorization = `Bearer ${newAccess}`;
            response = await fetch(url, { ...options, headers });
          } else {
            processQueue(new Error("Refresh failed"), null);
            await clearAuthTokens();
            return { success: false, error: "Session expired. Please log in again." };
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          await clearAuthTokens();
          return { success: false, error: "Failed to refresh connection" };
        } finally {
          isRefreshing = false;
        }
      }
    }

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: `HTTP ${response.status} ${response.statusText}`,
    }));

    return data;
  } catch (networkError) {
    console.error(`Network error requesting ${url}:`, networkError);
    return {
      success: false,
      error: "Unable to connect to MaduPay server. Check your internet connection.",
    };
  }
}
