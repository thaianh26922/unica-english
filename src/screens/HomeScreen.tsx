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
import { Card, PillButton, Screen } from '../components/Ui';
import { POPULAR_COURSES, TOP_PICK } from '../data/mockCourses';
import { theme } from '../theme/theme';

export const HomeScreen = memo(function HomeScreen() {
  const [query, setQuery] = useState('');

  const greeting = useMemo(() => {
    return { title: 'Hi,', name: 'Jerel', subtitle: 'Find your lessons today!' };
  }, []);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hi}>
              {greeting.title} <Text style={styles.hiName}>{greeting.name}</Text>
            </Text>
            <Text style={styles.subtitle}>{greeting.subtitle}</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.iconBadge}>
              <Ionicons name="notifications-outline" size={18} color={theme.colors.text} />
              <View style={styles.dot} />
            </View>
          </View>
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

        <Card style={styles.topPickCard}>
          <View style={styles.topPickRow}>
            <View style={styles.flex1}>
              <Text style={styles.topPickTitle}>{TOP_PICK.title}</Text>
              <View style={styles.topPickBigRow}>
                <Text style={styles.topPickBig}>{TOP_PICK.bigNumber}</Text>
                <Text style={styles.topPickSmall}>{TOP_PICK.subtitle}</Text>
              </View>
              <PillButton
                label={TOP_PICK.cta}
                onPress={() => {}}
                variant="primary"
                style={styles.topPickCta}
              />
            </View>
            <View style={styles.topPickArt}>
              <View style={styles.topPickArtInner} />
            </View>
          </View>
        </Card>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Popular lessons</Text>
          <Pressable accessibilityRole="button">
            <Text style={styles.sectionLink}>See All</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {POPULAR_COURSES.map(course => {
            return (
              <Card key={course.id} style={styles.courseCard}>
                <View style={styles.courseThumb} />
                <View style={styles.courseBody}>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseSubtitle} numberOfLines={1}>
                    {course.subtitle}
                  </Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaPill}>
                      <Text style={styles.metaPillText}>
                        <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} />{' '}
                        {course.durationLabel}
                      </Text>
                    </View>
                    <View style={styles.metaRight}>
                      <Ionicons name="star" size={12} color={theme.colors.warning} />
                      <Text style={styles.rating}>{course.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hi: {
    fontSize: theme.text.h1,
    color: theme.colors.text,
    fontWeight: '800',
  },
  hiName: {
    color: theme.colors.text,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: theme.text.body,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#fff',
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
  topPickCard: {
    backgroundColor: theme.colors.cardBlueSoft,
    borderColor: '#CFE5FF',
  },
  topPickRow: {
    flexDirection: 'row',
    gap: 12,
    padding: theme.spacing.lg,
  },
  topPickTitle: {
    fontSize: theme.text.h3,
    fontWeight: '800',
    color: theme.colors.text,
  },
  topPickBigRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  topPickBig: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  topPickSmall: {
    fontSize: theme.text.h3,
    fontWeight: '700',
    color: theme.colors.textMuted,
    paddingBottom: 6,
  },
  topPickCta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 18,
  },
  topPickArt: {
    width: 110,
    justifyContent: 'center',
  },
  topPickArtInner: {
    height: 110,
    borderRadius: 18,
    backgroundColor: '#BFE2FF',
    borderWidth: 1,
    borderColor: '#A7D5FF',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: theme.text.h2,
    fontWeight: '900',
    color: theme.colors.text,
  },
  sectionLink: {
    fontSize: theme.text.small,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  courseCard: {
    width: '47%',
    overflow: 'hidden',
  },
  courseThumb: {
    height: 96,
    backgroundColor: '#BFE2FF',
  },
  courseBody: {
    padding: 12,
    gap: 6,
  },
  courseTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  courseSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  metaPillText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
});

