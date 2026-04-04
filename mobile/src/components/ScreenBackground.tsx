import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  ReduceMotion,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const ORB_CONFIG = [
  { color: Colors.orb.primary, size: 220, x: -40, y: SCREEN_H * 0.12, driftX: 60, driftY: 40, duration: 7000, delay: 0 },
  { color: Colors.orb.secondary, size: 180, x: SCREEN_W * 0.55, y: SCREEN_H * 0.05, driftX: -50, driftY: 55, duration: 9000, delay: 500 },
  { color: Colors.orb.accent, size: 160, x: SCREEN_W * 0.3, y: SCREEN_H * 0.55, driftX: 45, driftY: -35, duration: 8000, delay: 1000 },
  { color: Colors.orb.tertiary, size: 200, x: SCREEN_W * 0.6, y: SCREEN_H * 0.7, driftX: -55, driftY: 45, duration: 10000, delay: 300 },
];

function FloatingOrb({ color, size, x, y, driftX, driftY, duration, delay }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    const easingFn = Easing.inOut(Easing.ease);
    const motionConfig = { reduceMotion: ReduceMotion.System };

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(driftX, { duration, easing: easingFn }),
          withTiming(0, { duration, easing: easingFn }),
        ),
        -1,
        true,
        undefined,
        motionConfig,
      ),
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(driftY, { duration: duration * 0.85, easing: easingFn }),
          withTiming(0, { duration: duration * 0.85, easing: easingFn }),
        ),
        -1,
        true,
        undefined,
        motionConfig,
      ),
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration * 0.6, easing: easingFn }),
          withTiming(0.85, { duration: duration * 0.6, easing: easingFn }),
        ),
        -1,
        true,
        undefined,
        motionConfig,
      ),
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration * 0.7, easing: easingFn }),
          withTiming(0.6, { duration: duration * 0.7, easing: easingFn }),
        ),
        -1,
        true,
        undefined,
        motionConfig,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function ScreenBackground({ children, variant = 'default' }) {
  const blurIntensity = Platform.OS === 'ios' ? 40 : 15;

  return (
    <View style={styles.container}>
      {/* Orb layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {ORB_CONFIG.map((orb, i) => (
          <FloatingOrb key={i} {...orb} />
        ))}
      </View>

      {/* Blur curtain to soften orb edges into "liquid" */}
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Content layer — crisp, above the blur */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
