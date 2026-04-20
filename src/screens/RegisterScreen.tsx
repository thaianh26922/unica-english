import React, { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, PillButton, Screen } from '../components/Ui';
import { useAuth } from '../auth/AuthContext';
import { theme } from '../theme/theme';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'register'>;

export const RegisterScreen = memo(function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = useCallback(async () => {
    setBusy(true);
    setError(null);
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setBusy(false);
      return;
    }
    const res = await register(fullName, email, password);
    if (!res.ok) setError(res.message);
    setBusy(false);
  }, [confirmPassword, email, fullName, password, register]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.brand}>UNICA</Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>Enter your details to get started.</Text>

          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#94A3B8" />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#94A3B8" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.inputWithIcon]}
            />
            <Pressable accessibilityRole="button" onPress={() => setShowPassword(v => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.colors.textMuted}
              />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#94A3B8" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PillButton
            label={busy ? 'Creating…' : 'Create Account'}
            onPress={onSubmit}
            style={styles.primaryBtn}
            rightIcon={<Ionicons name="arrow-forward" size={18} color="#fff" />}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable accessibilityRole="button" style={styles.socialBtn}>
              <Ionicons name="logo-google" size={16} color={theme.colors.text} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>
            <Pressable accessibilityRole="button" style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={18} color={theme.colors.text} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.muted}>Already have an account?</Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('login')}>
              <Text style={styles.link}>Sign In</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: 14,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 18, fontWeight: '900', color: theme.colors.text },
  card: { padding: 16, gap: 10 },
  title: { fontSize: 30, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, fontWeight: '700', color: theme.colors.textMuted, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '800', color: theme.colors.textMuted, marginTop: 4 },
  inputWrap: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: '#D7E8FF',
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontWeight: '800',
    paddingVertical: 0,
  },
  inputWithIcon: { paddingRight: 8 },
  error: { marginTop: 4, color: '#EF4444', fontWeight: '800' },
  primaryBtn: { marginTop: 10 },
  dividerRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { color: theme.colors.textMuted, fontWeight: '900', fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  socialBtn: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialText: { fontWeight: '900', color: theme.colors.text },
  bottomRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  muted: { color: theme.colors.textMuted, fontWeight: '700' },
  link: { color: theme.colors.primary, fontWeight: '900' },
});

