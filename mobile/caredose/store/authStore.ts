import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export interface User {
  id: string; // Firebase uid
  name: string;
  email: string;
  photoURL?: string;
  smsEnabled?: boolean;
  smsNumber?: string | null;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  firebaseReady: boolean;
  setAuth: (user: User, token?: string | null) => void;
  setFirebaseReady: () => void;
  updateUserSettings: (settings: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      firebaseReady: false,
      setAuth: (user, token = null) => set({ user, token, isAuthenticated: true }),
      setFirebaseReady: () => set({ firebaseReady: true }),
      updateUserSettings: (settings) => set((state) => ({ 
        user: state.user ? { ...state.user, ...settings } : null 
      })),
      logout: () => {
        signOut(auth);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "caredose-auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
