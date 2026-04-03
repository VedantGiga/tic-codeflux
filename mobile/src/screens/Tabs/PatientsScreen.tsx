import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenBackground from '../../components/ScreenBackground';
import { Colors } from '../../constants/Colors';

export default function PatientsScreen() {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Patients</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, color: Colors.textWarm, fontWeight: '700' },
});
