import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

export const FloatingTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.tabBarLabel || options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
              <Feather 
                name={options.tabBarIconName || 'grid'} 
                size={22} 
                color={isFocused ? '#3B82F6' : Colors.textSecondary} 
              />
              <Text style={[styles.label, { color: isFocused ? '#3B82F6' : Colors.textSecondary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 30, left: 20, right: 20, borderRadius: 30, overflow: 'hidden' },
  blur: { flexDirection: 'row', paddingVertical: 12, justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, marginTop: 4, fontWeight: '500' },
});
