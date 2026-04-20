import React, { memo, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, PillButton, Screen } from '../components/Ui';
import { COURSES } from '../data/english';
import { theme } from '../theme/theme';
import type { CourseStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CourseStackParamList, 'course'>;

export const CourseDetailScreen = memo(function CourseDetailScreen({ route, navigation }: Props) {
  const course = useMemo(() => {
    return COURSES.find(c => c.id === route.params.courseId) ?? null;
  }, [route.params.courseId]);

  if (!course) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Course not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.navIcon}>
            <Text style={styles.navIconText}>‹</Text>
          </Pressable>
          <Text style={styles.topTitle} numberOfLines={1}>
            {course.title}
          </Text>
          <Pressable accessibilityRole="button" style={styles.navIcon}>
            <Text style={styles.navIconText}>♡</Text>
          </Pressable>
        </View>

        <Card style={styles.heroCard}>
          <View style={styles.heroArt} />
          <View style={styles.heroPlay}>
            <Text style={styles.heroPlayText}>▶</Text>
          </View>
        </Card>

        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>{course.subtitle}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>★ {course.rating.toFixed(1)}</Text>
          <Text style={styles.metaText}>• {course.levelLabel}</Text>
          <Text style={styles.metaText}>• {course.durationLabel}</Text>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          <PillButton
            label="Start"
            onPress={() =>
              navigation.navigate('lesson', {
                courseId: course.id,
                lessonId: course.lessons[0]?.id ?? '',
              })
            }
            variant="primary"
          />
        </View>

        <View style={styles.lessonList}>
          {course.lessons.map((l, idx) => (
            <Pressable
              key={l.id}
              accessibilityRole="button"
              onPress={() => navigation.navigate('lesson', { courseId: course.id, lessonId: l.id })}
              style={({ pressed }) => [pressed && { opacity: 0.92 }]}
            >
              <Card style={styles.lessonRow}>
                <View style={styles.lessonIcon}>
                  <Text style={styles.lessonIconText}>{idx === 0 ? '▶' : '▸'}</Text>
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.lessonTitle} numberOfLines={1}>
                    {l.title}
                  </Text>
                  <Text style={styles.lessonDuration}>{l.durationLabel}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
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
    gap: theme.spacing.md,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 10,
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
  navIconText: { fontSize: 18, color: theme.colors.text, fontWeight: '900' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '900', color: theme.colors.text },
  heroCard: {
    height: 180,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7ECFF',
    borderColor: '#CFE5FF',
  },
  heroArt: { position: 'absolute', inset: 0, backgroundColor: '#BFE2FF' },
  heroPlay: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  heroPlayText: { fontSize: 22, color: theme.colors.primary, fontWeight: '900', marginLeft: 2 },
  courseTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.text, marginTop: 6 },
  courseSubtitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  metaText: { fontSize: 12, fontWeight: '800', color: theme.colors.textMuted },
  sectionRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  lessonList: { gap: 10, marginTop: 10 },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: theme.radius.lg,
  },
  lessonIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  lessonIconText: { fontWeight: '900', color: theme.colors.text },
  lessonTitle: { fontSize: 13, fontWeight: '900', color: theme.colors.text },
  lessonDuration: { marginTop: 3, fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  chevron: { fontSize: 18, fontWeight: '900', color: theme.colors.textMuted },
});

