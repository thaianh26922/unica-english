import React, { memo, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Screen } from '../components/Ui';
import { SEARCH_RESULTS } from '../data/mockCourses';
import { theme } from '../theme/theme';

type Chip = { id: string; label: string };

export const SearchScreen = memo(function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeChipId, setActiveChipId] = useState('ui');

  const chips = useMemo<readonly Chip[]>(
    () => [
      { id: 'ui', label: 'ui design' },
      { id: 'ux', label: 'ux design' },
      { id: 'web', label: 'website design' },
    ],
    [],
  );

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" style={styles.navIcon}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Search</Text>
          <Pressable accessibilityRole="button" style={styles.navIcon}>
            <Ionicons name="settings-outline" size={18} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search now..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <Pressable accessibilityRole="button" style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {chips.map(c => {
            const active = c.id === activeChipId;
            return (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                onPress={() => setActiveChipId(c.id)}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.results}>
          {SEARCH_RESULTS.map(item => {
            return (
              <Card key={item.id} style={styles.resultCard}>
                <View style={styles.thumbWrap}>
                  <View style={styles.thumb} />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.resultSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>

                  <View style={styles.resultMetaRow}>
                    <View style={styles.starsRow}>
                      <Text style={styles.star}>★</Text>
                      <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.duration}>{item.durationLabel}</Text>
                  </View>
                </View>
                <Ionicons name="heart-outline" size={18} color="#94A3B8" />
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: '#CFE5FF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
    textTransform: 'lowercase',
  },
  chipTextActive: {
    color: theme.colors.primary,
  },
  results: {
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: theme.radius.lg,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#D7ECFF',
    borderWidth: 1,
    borderColor: '#CFE5FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    width: 64,
    height: 64,
    backgroundColor: '#BFE2FF',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.text,
  },
  resultSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  resultMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: theme.colors.warning,
    fontWeight: '900',
  },
  rating: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.textMuted,
  },
  duration: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textMuted,
  },
});

