import { create } from "zustand";
import { User } from "../types/auth";
import { loginApi, registerApi, logoutApi, fetchSessionApi } from "../api/auth";
import { LoginFormData, RegisterFormData } from "../utils/validation";
import {
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getRefreshToken,
  clearAuthTokens,
} from "../utils/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (credentials: LoginFormData) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (!accessToken && !refreshToken) {
        set({ isInitialized: true, isAuthenticated: false, user: null });
        return;
      }

      // Check current session validity
      const response = await fetchSessionApi();
      if (response.success && response.data?.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
          isInitialized: true,
          error: null,
        });
      } else {
        // If session check fails, clear tokens
        await clearAuthTokens();
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      await clearAuthTokens();
      set({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },

  login: async (credentials: LoginFormData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await loginApi(credentials);
      if (res.success && res.data) {
        await setAccessToken(res.data.accessToken);
        await setRefreshToken(res.data.refreshToken);

        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: res.error || "Login failed. Please check your credentials.",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        isLoading: false,
      });
      return false;
    }
  },

  register: async (data: RegisterFormData) => {
    set({ isLoading: true, error: null });
    try {
      const { fullName, email, phone, password } = data;
      const res = await registerApi({ fullName, email, phone, password });
      if (res.success && res.data) {
        await setAccessToken(res.data.accessToken);
        await setRefreshToken(res.data.refreshToken);

        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          error: res.error || "Registration failed",
          isLoading: false,
        });
        return false;
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken).catch(() => {});
      }
    } finally {
      await clearAuthTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
}));
