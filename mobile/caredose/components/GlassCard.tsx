import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  elevated?: boolean;
  noPadding?: boolean;
  shimmer?: boolean;
}

export default function GlassCard({
  children,
  style,
  intensity = 25,
  elevated = false,
  noPadding = false,
  shimmer = true,
}: GlassCardProps) {
  const blurIntensity = Platform.OS === "ios" ? intensity * 1.5 : Math.min(intensity * 1.2, 20);
  const borderColor = elevated ? Colors.glass.borderElevated : Colors.glass.border;

  // Shimmer sweep animation — fires once on mount
  const shimmerTranslate = useSharedValue(-200);

  useEffect(() => {
    if (shimmer) {
      shimmerTranslate.value = withDelay(
        200,
        withTiming(400, {
          duration: 800,
          easing: Easing.out(Easing.ease),
        })
      );
    }
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  return (
    <View style={[styles.wrapper, elevated && styles.wrapperElevated, style]}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
        {/* Diagonal gloss highlight (curved glass) */}
        <LinearGradient
          colors={[Colors.glass.glossStart, Colors.glass.glossEnd]}
          start={{ x: 0.1, y: 0.0 }}
          end={{ x: 0.9, y: 0.7 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        
        {/* Top-edge water reflection highlight */}
        <LinearGradient
          colors={[Colors.glass.borderHighlight, "transparent"]}
          start={{ x: 0.5, y: 0.0 }}
          end={{ x: 0.5, y: 0.25 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Thin-edge inner overlay — luminous inner border */}
        <View style={[styles.thinEdge, { borderColor }]} pointerEvents="none" />

        {/* Shimmer sweep — single diagonal stripe on mount */}
        {shimmer && (
          <Animated.View
            style={[styles.shimmerStripe, shimmerStyle]}
            pointerEvents="none"
          />
        )}

        {/* Content */}
        <View style={!noPadding && styles.padding}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  wrapperElevated: {
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 8,
  },
  blur: {
    overflow: "hidden",
    backgroundColor: Colors.glass.background,
  },
  padding: {
    padding: 20,
  },
  thinEdge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderRadius: 19,
  },
  shimmerStripe: {
    position: "absolute",
    top: 0,
    left: -60,
    width: 60,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    transform: [{ skewX: "-20deg" }],
  },
});
