import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { GlassCard } from './GlassCard';

const STATUS_COLORS = {
  taken: Colors.taken,
  missed: Colors.missed,
  scheduled: Colors.scheduled,
};

function GlassBadge({ status }) {
  const color = STATUS_COLORS[status] || Colors.textSecondary;
  const blurIntensity = Platform.OS === 'ios' ? 15 : 8;

  return (
    <View style={badgeStyles.outer}>
      <BlurView intensity={blurIntensity} tint="dark" style={badgeStyles.blur}>
        {/* Color glow behind text */}
        <View style={[badgeStyles.glow, { backgroundColor: color + '18' }]} />
        <Text style={[badgeStyles.text, { color }]}>{status.toUpperCase()}</Text>
      </BlurView>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  outer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  blur: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

export default function MedicineDoseCard({ dose, onMarkTaken, onMarkMissed }) {
  const isTaken = dose.status === 'taken';
  const isMissed = dose.status === 'missed';
  const accentColor = STATUS_COLORS[dose.status] || Colors.textSecondary;

  return (
    <GlassCard style={styles.container}>
      {/* Left accent bar — status-colored edge */}
      <View style={[styles.accentBar, { backgroundColor: accentColor + '66' }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.info}>
            <Text style={styles.name}>{dose.medicineName}</Text>
            <Text style={styles.dosage}>{dose.dosage} • {dose.scheduledTime}</Text>
          </View>
          <GlassBadge status={dose.status} />
        </View>

        {!isTaken && !isMissed && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onMarkTaken(dose.logId)}
              style={styles.btn}
              activeOpacity={0.7}
            >
              <BlurView
                intensity={Platform.OS === 'ios' ? 12 : 6}
                tint="dark"
                style={styles.btnBlur}
              >
                <View style={[styles.btnGlow, { backgroundColor: Colors.taken + '25' }]} />
                <Feather name="check" size={16} color={Colors.taken} />
                <Text style={[styles.btnText, { color: Colors.taken }]}>Taken</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 2,
  },
  content: {
    paddingLeft: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
  },
  dosage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  btnBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  btnGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
