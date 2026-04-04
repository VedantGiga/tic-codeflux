import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore, Language } from "@/store/settingsStore";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "@/lib/i18n";

const LANGUAGES: { id: Language; name: string; nativeName: string }[] = [
  { id: "en", name: "English", nativeName: "English" },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { id: "mr", name: "Marathi", nativeName: "मराठी" },
];

export default function LanguageSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useSettingsStore();
  const { t } = useTranslation();

  // If no language selected yet, default selection to 'en' in local state temporarily
  const [selectedLang, setSelectedLang] = React.useState<Language>(language || "en");

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(selectedLang);
    router.replace("/onboarding");
  };

  const handleSelect = (id: Language) => {
    Haptics.selectionAsync();
    setSelectedLang(id);
    // Setting store immediately so the UI translates in real-time
    setLanguage(id); 
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background elements */}
      <View style={styles.abstractBackground} />
      <View style={styles.glow} />

      <View style={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }]}>
        
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Feather name="globe" size={32} color={Colors.text} />
          </View>
          <Text style={styles.title}>{t("language_title")}</Text>
          <Text style={styles.subtitle}>{t("language_subtitle")}</Text>
        </View>

        <View style={styles.list}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.card, isSelected && styles.cardActive]}
                activeOpacity={0.7}
                onPress={() => handleSelect(lang.id)}
              >
                <BlurView tint="dark" intensity={isSelected ? 40 : 20} style={styles.cardBlur}>
                  <View style={styles.cardContent}>
                    <View>
                      <Text style={[styles.nativeName, isSelected && styles.textActive]}>
                        {lang.nativeName}
                      </Text>
                      {lang.id !== "en" && (
                        <Text style={[styles.engName, isSelected && styles.textActiveMuted]}>
                          {lang.name}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.radio, isSelected && styles.radioActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.continueBtn} 
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>{t("continue")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  abstractBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050505",
  },
  glow: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    transform: [{ scale: 1.5 }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "DMSerifDisplay_400Regular",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  list: {
    flex: 1,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardActive: {
    borderColor: "#FFFFFF",
  },
  cardBlur: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nativeName: {
    fontSize: 20,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  engName: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255, 255, 255, 0.5)",
  },
  textActive: {
    color: "#FFFFFF",
  },
  textActiveMuted: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: "#FFFFFF",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  continueBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    color: "#000000",
  },
});
