import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    initialize,
    setError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    initialize,
    setError,
  };
}
