import React, { memo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PillButton, Screen } from '../components/Ui';
import { useAuth } from '../auth/AuthContext';
import { CHARACTERS } from '../characters/characters';
import { useCharacter } from '../characters/CharacterContext';
import { theme } from '../theme/theme';

export const ProfileScreen = memo(function ProfileScreen() {
  const { user, logout } = useAuth();
  const { characterId, setCharacterId } = useCharacter();

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Card style={styles.card}>
          <Text style={styles.sub}>Xin chào,</Text>
          <Text style={styles.name}>{user?.fullName ?? '—'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          <View style={styles.spacer} />

          <Text style={styles.sectionTitle}>Chọn nhân vật</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.characterRow}
          >
            {CHARACTERS.map(c => {
              const active = c.id === characterId;
              const thumb = c.frames[0];
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCharacterId(c.id)}
                  style={[styles.characterCard, active && styles.characterCardActive]}
                >
                  <View style={[styles.thumbWrap, active && styles.thumbWrapActive]}>
                    <Image source={thumb} style={styles.thumb} resizeMode="contain" />
                  </View>
                  <Text style={[styles.characterLabel, active && styles.characterLabelActive]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 8,
  },
  characterRow: {
    paddingTop: 10,
    paddingBottom: 6,
    gap: 12,
  },
  characterCard: {
    width: 110,
    padding: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  characterCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F8FAFF',
  },
  thumbWrap: {
    height: 78,
    borderRadius: 14,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbWrapActive: {
    backgroundColor: '#EAF2FF',
  },
  thumb: {
    width: 70,
    height: 70,
  },
  characterLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  characterLabelActive: {
    color: theme.colors.primary,
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

