import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Ui';
import { theme } from '../theme/theme';

export const ProfileScreen = memo(function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Coming soon</Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.text,
  },
  sub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});

