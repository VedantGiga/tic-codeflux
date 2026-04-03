import React, { useState } from "react";
import { BlurView } from "expo-blur";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/colors";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/authStore";
import { auth, getGoogleSignin } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const isExpoGo = Constants.appOwnership === "expo";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (name.trim().length < 2) newErrors.name = "Too short";
    if (!email.includes("@")) newErrors.email = "Invalid email";
    if (password.length < 6) newErrors.password = "Minimum 6 chars";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const syncAuth = async (firebaseUser: any, displayName?: string) => {
    try {
      const token = await firebaseUser.getIdToken();
      setAuth({
        id: firebaseUser.uid,
        name: displayName || firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || undefined,
      }, token);
      
      try {
        const { authApi } = require("@/lib/api");
        await authApi.me();
      } catch (e) {
        console.error("Profile sync failed:", e);
      }
    } catch (e) {
      console.error("Token fetch failed:", e);
      setAuth({
        id: firebaseUser.uid,
        name: displayName || firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        photoURL: firebaseUser.photoURL || undefined,
      });
    }
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await updateProfile(userCredential.user, { displayName: name.trim() });
      await syncAuth(userCredential.user, name.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (err: any) {
      let message = "Registration failed";
      if (err.code === "auth/email-already-in-use") message = "Email already in use";
      if (err.code === "auth/invalid-email") message = "Invalid email format";
      if (err.code === "auth/weak-password") message = "Password is too weak";
      
      Alert.alert("Registration Failed", message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (isExpoGo) {
      Alert.alert(
        "Development Build Required",
        "Google Sign-In requires a native module that isn't available in Expo Go. Please run this app as a Development Build (npx expo run:android/ios)."
      );
      return;
    }

    setLoading(true);
    try {
      const GoogleSignin = getGoogleSignin();
      if (!GoogleSignin) throw new Error("Google Sign-In failed to load");
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      
      if (!idToken) throw new Error("No ID Token found");
      
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      
      await syncAuth(userCredential.user);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.log("Google Registration Error:", err);
      if (err.code !== "7" && err.code !== "SIGN_IN_CANCELLED") {
        Alert.alert("Google Registration Failed", "Could not sign up with Google.");
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <View style={styles.abstractBackground} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.container,
            { paddingTop: topPad + 12, paddingBottom: bottomPad + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button Area */}
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Visual Area */}
          <View style={styles.spacer}>
            <Image
              source={require("@/assets/images/auth_bg_register.png")}
              style={{ width: 340, height: 340, opacity: 0.85, resizeMode: "contain" }}
            />
          </View>

          {/* Bottom-Weighted Form Area */}
          <View style={styles.formSection}>
            <View style={styles.header}>
              <Text style={styles.title}>Join CareDose</Text>
              <Text style={styles.subtitle}>Smart care for those who matter.</Text>
            </View>

            <BlurView tint="dark" intensity={60} style={styles.inputSlab}>
              {/* Name Row */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                  }}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.hairline} />

              {/* Email Row */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              
              <View style={styles.hairline} />

              {/* Password Row */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconToggle}>
                  <Text style={styles.eyeIconText}>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            {/* Error Messages */}
            {(errors.name || errors.email || errors.password) && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {errors.name || errors.email || errors.password}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryAction, loading && styles.primaryActionDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.primaryActionText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={handleGoogleRegister}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryActionText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomLink}
              onPress={() => router.back()}
            >
              <Text style={styles.bottomLinkText}>
                Have an account? <Text style={styles.bottomLinkBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { 
    flex: 1, 
    backgroundColor: "#000000" 
  },
  abstractBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050505",
    opacity: 0.9,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
  },
  topNav: {
    paddingVertical: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  formSection: {
    justifyContent: "flex-end",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontFamily: "DMSerifDisplay_400Regular",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },
  inputSlab: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 64, // Large touch target
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginLeft: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: "#FFFFFF",
    height: "100%",
  },
  eyeIconToggle: {
    paddingHorizontal: 8,
    height: "100%",
    justifyContent: "center",
  },
  eyeIconText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.5)",
  },
  errorContainer: {
    marginTop: -16,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.error,
  },
  primaryAction: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  primaryActionDisabled: {
    opacity: 0.6,
  },
  primaryActionText: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    color: "#000000",
  },
  secondaryAction: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 32,
  },
  secondaryActionText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
  bottomLink: {
    alignItems: "center",
  },
  bottomLinkText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.5)",
  },
  bottomLinkBold: {
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
  },
});
