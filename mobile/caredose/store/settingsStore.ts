import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Language = "en" | "hi" | "mr";

interface SettingsState {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: null,
      setLanguage: (lang) => set({ language: lang }),
      hasSeenOnboarding: false,
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: "caredose-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
