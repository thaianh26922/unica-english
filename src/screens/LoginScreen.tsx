import React, { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PillButton, Screen } from '../components/Ui';
import { useAuth } from '../auth/AuthContext';
import { theme } from '../theme/theme';
import type { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'login'>;

export const LoginScreen = memo(function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@unica.vn');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = useCallback(async () => {
    setBusy(true);
    setError(null);
    const res = await login(email, password);
    if (!res.ok) setError(res.message);
    setBusy(false);
  }, [email, login, password]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>UNICA</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.sub}>
          Enter your credentials to access your secure workspace.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrap}>
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

          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <Pressable accessibilityRole="button" onPress={() => {}}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </Pressable>
          </View>
          <View style={styles.inputWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              style={[styles.input, styles.inputWithIcon]}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowPassword(v => !v)}
              hitSlop={10}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={theme.colors.textMuted}
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PillButton
            label={busy ? 'Signing In…' : 'Sign In'}
            onPress={onSubmit}
            style={styles.primaryBtn}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
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
            <Text style={styles.muted}>New to UNICA?</Text>
            <Pressable accessibilityRole="button" onPress={() => navigation.navigate('register')}>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </View>
        </View>
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
  brand: { fontSize: 18, fontWeight: '900', color: theme.colors.primary },
  title: { fontSize: 34, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, fontWeight: '700', color: theme.colors.textMuted, lineHeight: 20 },
  form: { marginTop: 8, gap: 12 },
  label: { fontSize: 13, fontWeight: '800', color: theme.colors.textMuted },
  inputWrap: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: '#D7E8FF',
    paddingHorizontal: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontWeight: '800',
    paddingVertical: 0,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    height: 52,
    justifyContent: 'center',
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgot: { color: theme.colors.primary, fontWeight: '900', fontSize: 13 },
  error: { marginTop: 4, color: '#EF4444', fontWeight: '800' },
  primaryBtn: { marginTop: 10 },
  dividerRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { color: theme.colors.textMuted, fontWeight: '800', fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  socialBtn: {
    flex: 1,
    height: 54,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialText: { fontWeight: '900', color: theme.colors.text },
  bottomRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  muted: { color: theme.colors.textMuted, fontWeight: '700' },
  link: { color: theme.colors.primary, fontWeight: '900' },
});

