import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react-native';

export default function AuthScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoRow}>
            <View style={styles.logoBox}><ShieldAlert color="#FFF" size={20} /></View>
            <Text style={styles.logoText}>MediScan <Text style={{fontWeight: '800'}}>AI</Text></Text>
        </View>

        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Securely access your advanced diagnostic insights.</Text>

        <TextInput style={styles.input} placeholder="Clinical ID or Email" placeholderTextColor="#94A3B8" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} placeholderTextColor="#94A3B8" />

        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.loginBtnText}>Login</Text>
          <ArrowRight color="#FFF" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
            <View style={styles.line} /><Text style={styles.orText}>OR</Text><View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={() => navigation.navigate('Dashboard')}>
          <UserCheck color="#64748B" size={18} />
          <Text style={styles.guestText}>Continue in Guest Mode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E2E8F0', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, elevation: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  logoBox: { backgroundColor: '#0052CC', padding: 8, borderRadius: 8 },
  logoText: { fontSize: 18, color: '#1E293B' },
  welcomeText: { fontSize: 28, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  subText: { fontSize: 14, color: '#64748B', marginBottom: 25 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 15, borderRadius: 12, marginBottom: 15, color: '#1E293B' },
  loginBtn: { backgroundColor: '#0052CC', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 12, gap: 10, marginTop: 10 },
  loginBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  signUpBtn: { padding: 16, alignItems: 'center' },
  signUpText: { color: '#64748B', fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { marginHorizontal: 15, color: '#94A3B8', fontSize: 12 },
  guestBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, gap: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  guestText: { color: '#64748B', fontWeight: '600' }
});