import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';

export const Button = ({ title, onPress, variant = 'primary', loading = false, style }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.btn, 
        variant === 'primary' ? styles.primary : styles.secondary,
        style
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
