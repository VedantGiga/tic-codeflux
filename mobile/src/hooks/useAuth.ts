import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

export const useAuth = create<any>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, pass) => {
        const res = await authService.login(email, pass) as any;
        set({ user: { id: res.user.uid, name: res.user.displayName, email: res.user.email }, isAuthenticated: true });
      },
      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },
      setAuth: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: "caredose-auth",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
