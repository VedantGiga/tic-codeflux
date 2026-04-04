import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import { useQuery } from "@tanstack/react-query";
import { Colors } from "@/constants/colors";
import { aiApi, medicinesApi, patientsApi } from "@/lib/api";
import type { AIExtractedMedicine, Patient } from "@/lib/api";
import { usePatientStore } from "@/store/patientStore";
import PatientAvatar from "@/components/PatientAvatar";
import ScreenBackground from "@/components/ScreenBackground";

export default function PrescriptionScannerScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId, setSelectedPatient } = usePatientStore();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [medicines, setMedicines] = useState<AIExtractedMedicine[]>([]);
  const [rawText, setRawText] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Fetch patients to allow selection if none is selected
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: patientsApi.getAll,
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const [patientNumber, setPatientNumber] = useState("");
  const [searchingPatient, setSearchingPatient] = useState(false);

  // Auto-lookup patient by number
  useEffect(() => {
    if (patientNumber.length === 6) {
      handlePatientLookup(patientNumber);
    }
  }, [patientNumber]);

  const handlePatientLookup = async (num: string) => {
    setSearchingPatient(true);
    try {
      const patient = await patientsApi.getByNumber(num);
      setSelectedPatient(patient.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      // Not found or error
    } finally {
      setSearchingPatient(false);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    if (Platform.OS !== "web") {
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please grant permission to access your camera/gallery.");
        return;
      }
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8, mediaTypes: ImagePicker.MediaTypeOptions.Images });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImage(asset.uri);
      setMedicines([]);
      setRawText("");

      let base64 = asset.base64;
      if (!base64 && asset.uri && Platform.OS !== "web") {
        base64 = await FileSystem.readAsStringAsync(asset.uri, {
          encoding: "base64",
        });
      }

      if (!base64) {
        Alert.alert("Error", "Could not read image data");
        return;
      }

      setLoading(true);
      try {
        const result2 = await aiApi.parsePrescription(base64);
        setMedicines(result2.medicines);
        setRawText(result2.rawText);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to parse prescription";
        Alert.alert("Scan Error", errorMsg);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveAllToPatient = async () => {
    if (!selectedPatientId) {
      Alert.alert("Error", "Please select a patient first.");
      return;
    }

    if (medicines.length === 0) {
      Alert.alert("Error", "No medicines found to save.");
      return;
    }

    setSaving(true);
    try {
      await medicinesApi.createBatch(selectedPatientId, medicines);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "All medicines have been added to the patient's schedule.");
      router.push("/(tabs)"); // Go to home/dashboard
    } catch (err: unknown) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to save medicines");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Scan & Schedule</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Missing API Key Warning */}
      {rawText.includes("OPENAI_API_KEY") && (
        <View style={styles.apiWarning}>
          <Feather name="info" size={16} color={Colors.warning} />
          <Text style={styles.apiWarningText}>
            Demo Mode: OpenAI API Key missing in backend .env file.
          </Text>
        </View>
      )}

      {/* Patient Linking Segment */}
      <View style={styles.patientSelector}>
        <Text style={styles.sectionLabel}>1. Link Patient (Type 6-digit ID)</Text>
        <View style={styles.patientInputContainer}>
          <Feather name="user" size={18} color={Colors.textTertiary} style={styles.inputIcon} />
          <TextInput
            style={styles.patientInput}
            placeholder="Enter Patient ID (e.g. 100201)"
            placeholderTextColor={Colors.textTertiary}
            value={patientNumber}
            onChangeText={setPatientNumber}
            keyboardType="number-pad"
            maxLength={6}
          />
          {searchingPatient && <ActivityIndicator size="small" color={Colors.primary} />}
        </View>

        {selectedPatient && (
          <View style={styles.selectedPatientBanner}>
            <PatientAvatar name={selectedPatient.name} size={24} fontSize={10} />
            <Text style={styles.selectedPatientBannerText}>
              Linked to: <Text style={{ fontFamily: "DMSans_700Bold" }}>{selectedPatient.name}</Text>
            </Text>
            <TouchableOpacity onPress={() => { setSelectedPatient(null); setPatientNumber(""); }}>
              <Feather name="x-circle" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.sectionLabel}>2. Scan Prescription</Text>

      {!image ? (
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Feather name="camera" size={32} color={Colors.secondary} />
          </View>
          <Text style={styles.heroTitle}>AI Prescription Scanner</Text>
          <Text style={styles.heroSubtitle}>
            Upload or take a photo of any prescription and our AI will automatically extract medicines, dosages, and schedules.
          </Text>
        </View>
      ) : null}

      {!image ? (
        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => pickImage(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.uploadOptionIcon, { backgroundColor: "rgba(129, 140, 248, 0.12)" }]}>
              <Feather name="camera" size={26} color={Colors.secondary} />
            </View>
            <Text style={styles.uploadOptionTitle}>Take Photo</Text>
            <Text style={styles.uploadOptionSubtitle}>Use your camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => pickImage(false)}
            activeOpacity={0.8}
          >
            <View style={[styles.uploadOptionIcon, { backgroundColor: Colors.primaryLight }]}>
              <Feather name="image" size={26} color={Colors.primary} />
            </View>
            <Text style={styles.uploadOptionTitle}>Upload Image</Text>
            <Text style={styles.uploadOptionSubtitle}>From your gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageSection}>
          <Image source={{ uri: image }} style={styles.prescriptionImage} resizeMode="contain" />
          {!loading && (
            <TouchableOpacity
              style={styles.retakeBtn}
              onPress={() => { setImage(null); setMedicines([]); setRawText(""); }}
            >
              <Feather name="refresh-cw" size={14} color={Colors.textSecondary} />
              <Text style={styles.retakeBtnText}>Scan Another</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading && (
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>AI is analyzing your prescription...</Text>
          <Text style={styles.loadingSubtext}>This may take a few seconds</Text>
        </View>
      )}

      {medicines.length > 0 && (
        <View style={styles.resultsSection}>
          <View style={styles.resultHeader}>
            <Feather name="check-circle" size={18} color={Colors.taken} />
            <Text style={styles.resultTitle}>
              {medicines.length} Medicine{medicines.length > 1 ? "s" : ""} Found
            </Text>
          </View>

          {medicines.map((med, index) => (
            <View key={index} style={styles.medicineResult}>
              <View style={styles.medicineResultInfo}>
                <Text style={styles.medicineResultName}>{med.name}</Text>
                <Text style={styles.medicineResultDosage}>{med.dosage}</Text>
                <View style={styles.medicineResultBadgeContainer}>
                  <View style={[styles.freqBadge, { backgroundColor: "rgba(129, 140, 248, 0.12)" }]}>
                    <Text style={[styles.freqBadgeText, { color: Colors.secondary }]}>{med.frequency}</Text>
                  </View>
                  {med.times?.map((t, tidx) => (
                    <View key={tidx} style={styles.timeBadge}>
                      <Text style={styles.timeBadgeText}>{t.hour?.toString().padStart(2, '0')}:{t.minute?.toString().padStart(2, '0')}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[
              styles.saveAllBtn,
              (!selectedPatientId || saving) && styles.saveAllBtnDisabled
            ]}
            onPress={saveAllToPatient}
            disabled={!selectedPatientId || saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.background} size="small" />
            ) : (
              <>
                <Feather name="check" size={18} color={Colors.background} />
                <Text style={styles.saveAllBtnText}>Confirm & Save All to {selectedPatient?.name || "Patient"}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {image && !loading && medicines.length === 0 && rawText && (
        <View style={styles.noResultsSection}>
          <Feather name="alert-circle" size={24} color={Colors.warning} />
          <Text style={styles.noResultsText}>No medicines could be extracted</Text>
          <Text style={styles.noResultsSubtext}>
            Try with a clearer photo of the prescription
          </Text>
        </View>
      )}
    </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  navTitle: { fontSize: 17, fontFamily: "DMSans_600SemiBold", color: Colors.text },
  
  apiWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  apiWarningText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "#B45309",
    flex: 1,
  },

  patientSelector: {
    marginBottom: 24,
  },
  patientInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  patientInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: Colors.text,
  },
  selectedPatientBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  selectedPatientBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.taken,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "DMSans_700Bold",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  selectedPatientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  selectedPatientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedPatientName: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
  },
  selectedPatientMeta: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  changePatientBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  changePatientText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.primary,
  },
  selectPatientPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    gap: 12,
  },
  selectPatientText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.primary,
  },

  heroSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(129, 140, 248, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.2)",
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: "DMSerifDisplay_400Regular",
    color: Colors.textWarm,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  uploadSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: Colors.glass.background,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  uploadOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadOptionTitle: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
  },
  uploadOptionSubtitle: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  imageSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  prescriptionImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: Colors.glass.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  retakeBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
  },
  loadingSection: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
  },
  loadingSubtext: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    color: Colors.text,
  },
  medicineResult: {
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  medicineResultInfo: { flex: 1 },
  medicineResultName: {
    fontSize: 17,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
    marginBottom: 4,
  },
  medicineResultDosage: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  medicineResultBadgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  freqBadge: {
    backgroundColor: "rgba(129, 140, 248, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freqBadgeText: {
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
    color: Colors.secondary,
    textTransform: "uppercase",
  },
  timeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
    color: Colors.primary,
  },

  saveAllBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveAllBtnDisabled: {
    backgroundColor: Colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveAllBtnText: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    color: Colors.background,
  },

  noResultsSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
  },
  noResultsSubtext: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
