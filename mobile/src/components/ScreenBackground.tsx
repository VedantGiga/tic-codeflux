import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export default function ScreenBackground({ children, variant = 'default' }) {
  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
});
