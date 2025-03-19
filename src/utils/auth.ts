import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/useAuthStore";
import { useRefreshToken } from "../queries/auth";

export function revalidateAuth() {
  if (!checkTokenValidity()) {
    useAuthStore.setState((store) => ({ ...store, isAuthenticated: false }));
  }
}

export function checkTokenValidity() {
  const CLOCK_SKEW_MARGIN = 1000 * 60 * 5; // 5 minutes
  const token = localStorage.getItem("accesstoken");
  if (!token) return true;
  const decodedToken = decodeAuthToken(token);
  const currentDate = new Date();
  if (
    decodedToken?.exp * 1000 - currentDate.getTime() <
    CLOCK_SKEW_MARGIN
  )
    return false;
  return true;
}

export function decodeAuthToken(accesstoken: string): any {
  const decodedToken = jwtDecode(accesstoken);
  return decodedToken;
}

export function useClearCredentials() {
  const credentialKeys = ["accesstoken", "id"];
  credentialKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
  useAuthStore().clear();
}

export async function refreshAuthToken(): Promise<string | null> {
  const store = useAuthStore.getState();
  const refreshToken = store.refreshToken;
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await useRefreshToken().mutateAsync(refreshToken);
    if (response?.access_token) {
      useAuthStore.setState((state) => ({
        ...state,
        accessToken: `Bearer ${response.access_token}`,
        isAuthenticated: true
      }));
      return response.access_token;
    }
  } catch (error) {
    useAuthStore.setState((state) => ({
      ...state,
      isAuthenticated: false,
      accessToken: undefined,
      refreshToken: undefined
    }));
  }
  return null;
}
