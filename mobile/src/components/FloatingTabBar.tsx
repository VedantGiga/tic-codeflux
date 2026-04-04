import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

const AnimatedView = Animated.View;

export const FloatingTabBar = ({ state, descriptors, navigation }) => {
  const blurIntensity = Platform.OS === 'ios' ? 40 : 15;

  return (
    <View style={styles.container}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.blur}>
        {/* Top-edge horizontal gloss shimmer */}
        <LinearGradient
          colors={[Colors.glass.glossStart, Colors.glass.glossEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topGloss}
          pointerEvents="none"
        />

        {/* Thin-edge inner overlay */}
        <View style={styles.thinEdge} pointerEvents="none" />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel || options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Feather
                name={options.tabBarIconName || 'grid'}
                size={22}
                color={isFocused ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? Colors.primary : Colors.textSecondary },
                ]}
              >
                {label}
              </Text>
              {/* Active dot indicator */}
              <ActiveDot active={isFocused} />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

function ActiveDot({ active }) {
  const scale = useSharedValue(active ? 1 : 0);
  const opacity = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(active ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withSpring(active ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={[styles.activeDot, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  blur: {
    flexDirection: 'row',
    paddingVertical: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.glass.background,
  },
  topGloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  thinEdge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderColor: Colors.glass.borderHighlight,
    borderRadius: 29,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
});
