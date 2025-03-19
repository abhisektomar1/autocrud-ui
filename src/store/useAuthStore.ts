/* eslint-disable */
import createStore from "zustand";
import { configurePersist } from "zustand-persist";

const { persist: _persist } = configurePersist({
  storage: localStorage,
  rootKey: "root",
});

const persist = _persist as any;
interface Auth {
  isAuthenticated?: boolean;
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  name?: string;         
  id?: string;
  role?: string;
  provider?: "email" | "github"; 
}

interface AuthStore extends Auth {
  setAuth: (auth: Auth | ((auth: Auth) => Auth)) => void;
  clear: () => void;
}

export const useAuthStore = createStore<AuthStore>(
  persist(
    {
      key: "auth",
    },
    (set: any) => ({
      isAuthenticated: false,
      accessToken: undefined,
      refreshToken: undefined, 
      email: undefined,
      name: undefined,
      id: undefined,
      role: undefined,
      provider: undefined, 
      setAuth: (auth: Auth | ((auth: Auth) => Auth)) => {
        if (typeof auth === "function") {
          set((_state: Auth) => auth(_state));
        } else {
          set((_state: Auth) => auth);
        }
      },
      clear: () => {
        set((_state: Auth) => ({
          isAuthenticated: false,
          accessToken: undefined,
          refreshToken: undefined,
          email: undefined,
          name: undefined,
          id: undefined,
          role: undefined,
          provider: undefined,
        }));
      },
    })
  )
);
