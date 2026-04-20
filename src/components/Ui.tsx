import React, { memo } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

export const Screen = memo(function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
});

export const Card = memo(function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
});

export const PillButton = memo(function PillButton({
  label,
  onPress,
  variant = 'primary',
  rightIcon,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'soft' | 'ghost';
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pillBase,
        variant === 'primary' && styles.pillPrimary,
        variant === 'soft' && styles.pillSoft,
        variant === 'ghost' && styles.pillGhost,
        pressed && styles.pillPressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.pillText,
          variant === 'primary' && styles.pillTextPrimary,
        ]}
      >
        {label}
      </Text>
      {rightIcon ? (
        <View style={styles.pillIcon}>{rightIcon}</View>
      ) : null}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  pillBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
  },
  pillPrimary: {
    backgroundColor: theme.colors.primary,
  },
  pillSoft: {
    backgroundColor: theme.colors.primarySoft,
  },
  pillGhost: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pillPressed: {
    opacity: 0.9,
  },
  pillText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  pillTextPrimary: {
    color: '#fff',
  },
  pillIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

