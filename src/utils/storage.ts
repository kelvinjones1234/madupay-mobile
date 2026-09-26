import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "madupay_access_token";
const REFRESH_TOKEN_KEY = "madupay_refresh_token";

/**
 * Platform-safe SecureStore wrapper with browser fallback.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return null;
  }
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key} from storage:`, error);
  }
}

// Token-specific convenience methods
export async function getAccessToken(): Promise<string | null> {
  return await getSecureItem(ACCESS_TOKEN_KEY);
}

export async function setAccessToken(token: string): Promise<void> {
  await setSecureItem(ACCESS_TOKEN_KEY, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return await getSecureItem(REFRESH_TOKEN_KEY);
}

export async function setRefreshToken(token: string): Promise<void> {
  await setSecureItem(REFRESH_TOKEN_KEY, token);
}

export async function clearAuthTokens(): Promise<void> {
  await deleteSecureItem(ACCESS_TOKEN_KEY);
  await deleteSecureItem(REFRESH_TOKEN_KEY);
}
