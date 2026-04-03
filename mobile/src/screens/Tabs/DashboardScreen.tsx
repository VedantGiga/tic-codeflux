import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePatients } from '../../hooks/usePatients';
import ScreenBackground from '../../components/ScreenBackground';
import MedicineDoseCard from '../../components/MedicineDoseCard';
import { Colors } from '../../constants/Colors';

export default function DashboardScreen() {
  const { data: patients, isLoading } = usePatients();

  return (
    <ScreenBackground>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Patient Adherence Tracking</Text>
        {patients.map((dose, index) => (
          <MedicineDoseCard 
            key={index} 
            dose={dose} 
            onMarkTaken={() => {}} 
            onMarkMissed={() => {}} 
          />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 30, color: Colors.textWarm, fontWeight: '700', marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 20 },
});
