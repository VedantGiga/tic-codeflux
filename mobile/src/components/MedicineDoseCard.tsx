import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { GlassCard } from './GlassCard';

export default function MedicineDoseCard({ dose, onMarkTaken, onMarkMissed }) {
  const isTaken = dose.status === 'taken';
  const isMissed = dose.status === 'missed';

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{dose.medicineName}</Text>
          <Text style={styles.dosage}>{dose.dosage} • {dose.scheduledTime}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: Colors[dose.status] + '20' }]}>
          <Text style={[styles.statusText, { color: Colors[dose.status] }]}>{dose.status.toUpperCase()}</Text>
        </View>
      </View>
      {!isTaken && !isMissed && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onMarkTaken(dose.logId)} style={[styles.btn, { backgroundColor: Colors.taken }]}>
            <Feather name="check" size={16} color="white" />
            <Text style={styles.btnText}>Taken</Text>
          </TouchableOpacity>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, color: Colors.text, fontWeight: '700' },
  dosage: { fontSize: 14, color: Colors.textSecondary },
  statusTag: { padding: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 6 },
  btnText: { color: 'white', fontWeight: '600' },
});
