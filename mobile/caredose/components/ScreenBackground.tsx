import React from "react";
import { View, StyleSheet, ViewStyle, Image } from "react-native";
import { Colors } from "@/constants/colors";

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenBackground({
  children,
  style,
}: ScreenBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Static Image Background, entirely untouched raw image */}
      <Image
        source={require("../background.jpeg")}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Content layer */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
});
