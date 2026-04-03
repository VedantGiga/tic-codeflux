import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { Button } from '../components/Button';
import { Colors } from '../constants/Colors';

export default function OnboardingScreen({ navigation }) {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>CareDose AI</Text>
        <Text style={styles.subtitle}>Your AI Powered Medicine Tracker</Text>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('Login')} 
          style={styles.btn}
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 36, color: Colors.textWarm, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: Colors.textSecondary, marginBottom: 40, textAlign: 'center' },
  btn: { width: '100%' },
});
