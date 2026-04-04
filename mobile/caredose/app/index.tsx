import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect, useState } from "react";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const language = useSettingsStore((s) => s.language);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand stores to finish hydrating from AsyncStorage
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If already hydrated (hot reload or fast init), set immediately
    if (useSettingsStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  // Show a loading state while stores are hydrating
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Route based on state
  if (!language) {
    return <Redirect href={"/language" as any} />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}
