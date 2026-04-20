import React, { memo, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, PillButton, Screen } from '../components/Ui';
import { COURSES } from '../data/english';
import { theme } from '../theme/theme';
import type { CourseStackParamList } from '../navigation';

type Props = NativeStackScreenProps<CourseStackParamList, 'courses'>;

export const CoursesScreen = memo(function CoursesScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COURSES;
    return COURSES.filter(c => c.title.toLowerCase().includes(q));
  }, [query]);

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
              Hi, <Text style={styles.hiName}>Jerel</Text>
            </Text>
            <Text style={styles.subtitle}>Học tiếng Anh mỗi ngày nhé!</Text>
          </View>
          <View style={styles.iconBadge}>
            <Ionicons name="notifications-outline" size={18} color={theme.colors.text} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search courses…"
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
              <Text style={styles.topPickTitle}>Discover Top Picks</Text>
              <View style={styles.topPickBigRow}>
                <Text style={styles.topPickBig}>+100</Text>
                <Text style={styles.topPickSmall}>words</Text>
              </View>
              <PillButton
                label="Start 5-min practice"
                onPress={() => navigation.navigate('lesson', { courseId: 'daily-speaking', lessonId: 'greetings' })}
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
          <Text style={styles.sectionTitle}>Courses</Text>
          <Text style={styles.sectionLink}>{filtered.length} found</Text>
        </View>

        <View style={styles.list}>
          {filtered.map(course => (
            <Pressable
              key={course.id}
              accessibilityRole="button"
              onPress={() => navigation.navigate('course', { courseId: course.id })}
              style={({ pressed }) => [pressed && { opacity: 0.92 }]}
            >
              <Card style={styles.courseCard}>
                <View style={styles.thumb} />
                <View style={styles.courseBody}>
                  <Text style={styles.courseTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <Text style={styles.courseSubtitle} numberOfLines={1}>
                    {course.subtitle}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>★ {course.rating.toFixed(1)}</Text>
                    <Text style={styles.metaText}>• {course.levelLabel}</Text>
                    <Text style={styles.metaText}>• {course.durationLabel}</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
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
  hiName: { fontWeight: '900' },
  subtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontSize: theme.text.body,
    fontWeight: '600',
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
    fontWeight: '700',
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
  topPickRow: { flexDirection: 'row', gap: 12, padding: theme.spacing.lg },
  topPickTitle: { fontSize: theme.text.h3, fontWeight: '900', color: theme.colors.text },
  topPickBigRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  topPickBig: { fontSize: 32, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5 },
  topPickSmall: { fontSize: theme.text.h3, fontWeight: '800', color: theme.colors.textMuted, paddingBottom: 6 },
  topPickCta: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 18 },
  topPickArt: { width: 110, justifyContent: 'center' },
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
  sectionTitle: { fontSize: theme.text.h2, fontWeight: '900', color: theme.colors.text },
  sectionLink: { fontSize: theme.text.small, fontWeight: '800', color: theme.colors.textMuted },
  list: { gap: 12 },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumb: { width: 84, height: 84, backgroundColor: '#BFE2FF' },
  courseBody: { flex: 1, padding: 12, gap: 6 },
  courseTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.text },
  courseSubtitle: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 2 },
  metaText: { fontSize: 12, fontWeight: '800', color: theme.colors.textMuted },
});

