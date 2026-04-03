import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const PatientAvatar = ({ source, name, size = 40 }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>{name?.[0]?.toUpperCase() || 'P'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  initials: { color: 'white', fontWeight: 'bold' },
});
