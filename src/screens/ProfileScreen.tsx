import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, PillButton, Screen } from '../components/Ui';
import { useAuth } from '../auth/AuthContext';
import { theme } from '../theme/theme';

export const ProfileScreen = memo(function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Card style={styles.card}>
          <Text style={styles.sub}>Xin chào,</Text>
          <Text style={styles.name}>{user?.fullName ?? '—'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          <View style={styles.spacer} />
          <PillButton label="Đăng xuất" onPress={logout} variant="ghost" />
        </Card>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.text,
  },
  card: {
    alignSelf: 'stretch',
    padding: 16,
    gap: 4,
  },
  sub: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 2,
  },
  email: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  spacer: { height: 10 },
});

