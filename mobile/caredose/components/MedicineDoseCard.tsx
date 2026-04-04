import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/colors";
import type { MedicineDoseStatus } from "@/lib/api";
import GlassCard from "./GlassCard";

interface Props {
  dose: MedicineDoseStatus;
  onMarkTaken?: (logId: string) => void;
  onMarkMissed?: (logId: string) => void;
}

function GlassBadge({ statusConfig }: any) {
  const blurIntensity = Platform.OS === "ios" ? 15 : 8;
  return (
    <View style={badgeStyles.outer}>
      <BlurView intensity={blurIntensity} tint="dark" style={badgeStyles.blur}>
        <View style={[badgeStyles.glow, { backgroundColor: statusConfig.color + "30" }]} />
        <LinearGradient
          colors={["rgba(255,255,255,0.4)", "transparent"]}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Feather name={statusConfig.icon} size={11} color={statusConfig.color} />
        <Text style={[badgeStyles.text, { color: statusConfig.color }]}>
          {statusConfig.label.toUpperCase()}
        </Text>
      </BlurView>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  outer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.12)",
  },
  blur: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  text: {
    fontSize: 10,
    fontFamily: "DMSans_700Bold",
    letterSpacing: 0.8,
  },
});

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function getStatusConfig(status: MedicineDoseStatus["status"]) {
  switch (status) {
    case "taken":
      return {
        color: Colors.taken,
        bg: Colors.takenLight,
        label: "Taken",
        icon: "check-circle" as const,
      };
    case "missed":
      return {
        color: Colors.missed,
        bg: Colors.missedLight,
        label: "Missed",
        icon: "x-circle" as const,
      };
    default:
      return {
        color: Colors.pending,
        bg: Colors.pendingLight,
        label: "Pending",
        icon: "clock" as const,
      };
  }
}

export default function MedicineDoseCard({ dose, onMarkTaken, onMarkMissed }: Props) {
  const statusConfig = getStatusConfig(dose.status);

  const handleMarkTaken = () => {
    if (!dose.logId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Mark as Taken",
      `Confirm ${dose.medicineName} ${dose.dosage} was taken?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => onMarkTaken?.(dose.logId!),
        },
      ],
    );
  };

  const handleMarkMissed = () => {
    if (!dose.logId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Mark as Missed",
      `Mark ${dose.medicineName} as missed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => onMarkMissed?.(dose.logId!),
        },
      ],
    );
  };

  return (
    <GlassCard style={styles.cardOuter} noPadding>
      <View style={styles.cardRow}>
        <View style={[styles.statusStrip, { backgroundColor: statusConfig.color + "66" }]} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.nameSection}>
              <Text style={styles.medicineName}>{dose.medicineName}</Text>
              <Text style={styles.dosage}>{dose.dosage}</Text>
            </View>
            <GlassBadge statusConfig={statusConfig} />
          </View>

            <View style={styles.footer}>
              <View style={styles.timeRow}>
                <Feather name="clock" size={13} color={Colors.textTertiary} />
                <Text style={styles.timeText}>{formatTime(dose.scheduledTime)}</Text>
                {dose.source && (
                  <View style={styles.sourceChip}>
                    <Text style={styles.sourceText}>{dose.source}</Text>
                  </View>
                )}
              </View>

            {dose.status === "pending" && dose.logId && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtnGrid}
                  onPress={handleMarkTaken}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={Platform.OS === "ios" ? 18 : 12} tint="dark" style={styles.btnBlur}>
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.taken + "25" }]} />
                    <LinearGradient
                      colors={["rgba(255,255,255,0.25)", "transparent"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 0.5 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                    <Feather name="check" size={13} color={Colors.taken} />
                    <Text style={[styles.actionText, { color: Colors.taken }]}>Taken</Text>
                  </BlurView>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnGrid}
                  onPress={handleMarkMissed}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={Platform.OS === "ios" ? 18 : 12} tint="dark" style={styles.btnBlur}>
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: Colors.missed + "25" }]} />
                    <LinearGradient
                      colors={["rgba(255,255,255,0.25)", "transparent"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 0.5 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />
                    <Feather name="x" size={13} color={Colors.missed} />
                    <Text style={[styles.actionText, { color: Colors.missed }]}>Missed</Text>
                  </BlurView>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
  },
  statusStrip: {
    width: 3,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 17,
    fontFamily: "DMSans_600SemiBold",
    color: Colors.text,
    marginBottom: 2,
  },
  dosage: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.textSecondary,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: Colors.textTertiary,
  },
  sourceChip: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sourceText: {
    fontSize: 10,
    fontFamily: "DMSans_500Medium",
    color: Colors.textSecondary,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
  },
  actionBtnGrid: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  btnBlur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  actionText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
});
