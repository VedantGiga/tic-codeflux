import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
  TextInput,
  Switch,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import PatientAvatar from "@/components/PatientAvatar";
import ScreenBackground from "@/components/ScreenBackground";
import { authApi } from "@/lib/api";

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
  rightText?: string;
}

function SettingItem({ icon, label, onPress, danger, rightText, rightElement }: SettingItemProps & { rightElement?: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.6} disabled={!!rightElement}>
      <View style={[styles.settingIconWrapper, danger && { backgroundColor: Colors.missedLight }]}>
        <Feather name={icon} size={16} color={danger ? Colors.missed : Colors.textSecondary} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
      <View style={styles.settingRight}>
        {rightText && <Text style={styles.settingRightText}>{rightText}</Text>}
        {rightElement ? rightElement : <Feather name="chevron-right" size={14} color={Colors.textTertiary} />}
      </View>
    </TouchableOpacity>
  );
}

function GlassSection({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.glassSectionOuter}>
      <BlurView intensity={Platform.OS === "ios" ? 20 : 10} tint="dark" style={styles.glassSectionBlur}>
        {children}
      </BlurView>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUserSettings } = useAuthStore();
  
  const [isSmsModalVisible, setIsSmsModalVisible] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const toggleSms = async (enabled: boolean) => {
    if (!user?.smsNumber && enabled) {
      setIsSmsModalVisible(true);
      return;
    }
    
    try {
      updateUserSettings({ smsEnabled: enabled });
      await authApi.toggleSms(enabled);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch(err) {
      updateUserSettings({ smsEnabled: !enabled });
      Alert.alert("Error", "Could not toggle SMS alerts.");
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) return Alert.alert("Error", "Invalid phone number");
    setIsLoading(true);
    try {
      await authApi.sendOtp(phoneNumber);
      setIsOtpSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch(err) {
      Alert.alert("Error", "Could not send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return Alert.alert("Error", "Invalid OTP");
    setIsLoading(true);
    try {
      await authApi.verifyOtp(phoneNumber, otp);
      updateUserSettings({ smsEnabled: true, smsNumber: phoneNumber });
      setIsSmsModalVisible(false);
      setIsOtpSent(false);
      setPhoneNumber("");
      setOtp("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "SMS alerts have been setup successfully!");
    } catch(err) {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenBackground variant="warm">
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      >
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Glass Profile Card */}
        <View style={styles.profileCardOuter}>
          <BlurView intensity={Platform.OS === "ios" ? 25 : 12} tint="dark" style={styles.profileCardBlur}>
            <View style={styles.profileCardInner}>
              <PatientAvatar name={user?.name ?? "User"} size={68} fontSize={24} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patients</Text>
          <GlassSection>
            <SettingItem
              icon="users"
              label="Manage Patients"
              onPress={() => router.push("/patients/list")}
            />
            <SettingItem
              icon="user-plus"
              label="Add New Patient"
              onPress={() => router.push("/patients/add")}
            />
          </GlassSection>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <GlassSection>
            <SettingItem
              icon="phone"
              label="Call Settings"
              onPress={() => Alert.alert("Coming Soon", "Configure call settings in a future update")}
              rightText="Twilio"
            />
            <SettingItem
              icon="message-square"
              label="SMS Emergency Alerts"
              onPress={() => {}}
              rightText={user?.smsNumber ? user.smsNumber : undefined}
              rightElement={
                <Switch
                  value={!!user?.smsEnabled}
                  onValueChange={toggleSms}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.background}
                />
              }
            />
          </GlassSection>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <GlassSection>
            <SettingItem
              icon="info"
              label="About CareDose AI"
              onPress={() =>
                Alert.alert(
                  "CareDose AI",
                  "Version 1.0.0\n\nSmart Medicine Assistant for Elderly\n\nPowered by AI voice calls and intelligent scheduling.",
                )
              }
            />
            <SettingItem
              icon="log-out"
              label="Sign Out"
              onPress={handleLogout}
              danger
            />
          </GlassSection>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Feather name="heart" size={13} color={Colors.primary} />
            <Text style={styles.footerText}>CareDose AI</Text>
          </View>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* SMS Setup Modal */}
      <Modal visible={isSmsModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Setup SMS Alerts</Text>
              <TouchableOpacity onPress={() => setIsSmsModalVisible(false)}>
                <Feather name="x" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Receive an SMS alert if a medicine reminder call is missed twice.
            </Text>

            {!isOtpSent ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mobile Number (with +91)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+919876543210"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.primaryButtonText}>Send OTP</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Enter 6-Digit OTP</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123456"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOtp} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.primaryButtonText}>Verify & Enable</Text>}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSerifDisplay_400Regular",
    color: Colors.textWarm,
  },
  // Glass Profile Card
  profileCardOuter: {
    marginHorizontal: 24,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.borderElevated,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  profileCardBlur: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  profileCardInner: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontFamily: "DMSans_700Bold",
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  // Glass Setting Sections
  glassSectionOuter: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  glassSectionBlur: {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
  },
  dangerText: {
    color: Colors.missed,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingRightText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 4,
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.textSecondary,
  },
  footerVersion: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "DMSerifDisplay_400Regular",
    color: Colors.textWarm,
  },
  modalText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
});
