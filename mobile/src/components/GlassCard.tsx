import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export const GlassCard = ({ children, style, shimmer = true }) => {
  const blurIntensity = Platform.OS === 'ios' ? 25 : 12;

  // Shimmer sweep animation — fires once on mount
  const shimmerTranslate = useSharedValue(-200);

  useEffect(() => {
    if (shimmer) {
      shimmerTranslate.value = withDelay(
        200,
        withTiming(400, {
          duration: 800,
          easing: Easing.out(Easing.ease),
        }),
      );
    }
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  return (
    <View style={[styles.outer, style]}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
        {/* Diagonal gloss highlight */}
        <LinearGradient
          colors={[Colors.glass.glossStart, Colors.glass.glossEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Thin-edge inner overlay — luminous inner border */}
        <View style={styles.thinEdge} pointerEvents="none" />

        {/* Shimmer sweep — single diagonal stripe on mount */}
        {shimmer && (
          <Animated.View
            style={[styles.shimmerStripe, shimmerStyle]}
            pointerEvents="none"
          />
        )}

        {/* Content */}
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  blur: {
    backgroundColor: Colors.glass.background,
  },
  thinEdge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderColor: Colors.glass.borderHighlight,
    borderRadius: 19,
  },
  shimmerStripe: {
    position: 'absolute',
    top: 0,
    left: -60,
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    transform: [{ skewX: '-20deg' }],
  },
  inner: {
    padding: 18,
  },
});
