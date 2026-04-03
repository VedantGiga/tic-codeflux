import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import ScreenBackground from '../../components/ScreenBackground';
import { GlassCard } from '../../components/GlassCard';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <GlassCard style={styles.card}>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor={Colors.textTertiary}/>
          <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} placeholderTextColor={Colors.textTertiary}/>
          <TouchableOpacity onPress={() => login(email, password)} style={styles.btn}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, color: Colors.textWarm, fontWeight: '700', marginBottom: 20 },
  card: { padding: 20 },
  input: { borderBottomWidth: 1, borderColor: Colors.border, color: Colors.text, padding: 12, marginBottom: 16 },
  btn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
});
