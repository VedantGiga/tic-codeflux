import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

export const GlassCard = ({ children, style }) => {
  return (
    <View style={[styles.outer, style]}>
      <BlurView intensity={Platform.OS === 'ios' ? 20 : 10} tint="dark" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.glass.border },
  blur: { backgroundColor: 'rgba(255,255,255,0.03)' },
  inner: { padding: 18 },
});
