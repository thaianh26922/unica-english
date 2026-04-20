import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, PillButton, Screen } from '../components/Ui';
import { theme } from '../theme/theme';

export const OverviewScreen = memo(function OverviewScreen() {
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" style={styles.navIcon}>
            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Course Overview</Text>
          <Pressable accessibilityRole="button" style={styles.navIcon}>
            <Ionicons name="heart-outline" size={18} color={theme.colors.text} />
          </Pressable>
        </View>

        <Card style={styles.heroCard}>
          <View style={styles.heroArt} />
          <View style={styles.heroPlay}>
            <Text style={styles.heroPlayText}>▶</Text>
          </View>
        </Card>

        <Text style={styles.courseTitle}>English master class for beginners</Text>
        <View style={styles.courseMetaRow}>
          <Text style={styles.courseMeta}>
            <Ionicons name="time-outline" size={12} color={theme.colors.textMuted} /> 6h 30min
          </Text>
          <Text style={styles.courseMeta}>• 28 lessons</Text>
          <Text style={styles.courseMeta}>★ 4.9</Text>
        </View>

        <View style={styles.tabsRow}>
          <Text style={[styles.tab, styles.tabActive]}>Lessons</Text>
          <Text style={styles.tab}>Description</Text>
        </View>

        <View style={styles.lessonList}>
          <LessonItem title="Introduction" duration="04:28 min" active />
          <LessonItem title="Understanding Interface" duration="06:12 min" />
          <LessonItem title="Create first design project" duration="43:58 min" />
          <LessonItem title="Prototyping the design" duration="12:03 min" disabled />
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>$399</Text>
          </View>
          <PillButton
            label="Enroll Now"
            onPress={() => {}}
            variant="primary"
            style={styles.enrollBtn}
          />
        </View>
      </ScrollView>
    </Screen>
  );
});

const LessonItem = memo(function LessonItem({
  title,
  duration,
  active,
  disabled,
}: {
  title: string;
  duration: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.lessonRow,
        active && styles.lessonRowActive,
        disabled && styles.lessonRowDisabled,
        pressed && !disabled && { opacity: 0.9 },
      ]}
    >
      <View style={[styles.lessonIcon, active && styles.lessonIconActive]}>
        <Text style={styles.lessonIconText}>{active ? '▶' : '▸'}</Text>
      </View>
      <View style={styles.flex1}>
        <Text
          style={[styles.lessonTitle, disabled && styles.lessonTextDisabled]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[styles.lessonDuration, disabled && styles.lessonTextDisabled]}
        >
          {duration}
        </Text>
      </View>
      <Text style={[styles.lessonChevron, disabled && styles.lessonTextDisabled]}>
        ›
      </Text>
    </Pressable>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  heroCard: {
    height: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7ECFF',
    borderColor: '#CFE5FF',
  },
  heroArt: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#BFE2FF',
  },
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
  heroPlayText: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: '900',
    marginLeft: 2,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: 4,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  courseMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 8,
    marginBottom: 6,
  },
  tab: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '800',
    paddingVertical: 6,
  },
  tabActive: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  lessonList: {
    gap: 10,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  lessonRowActive: {
    borderColor: '#CFE5FF',
    backgroundColor: '#F3F9FF',
  },
  lessonRowDisabled: {
    opacity: 0.5,
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
  lessonIconActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  lessonIconText: {
    color: theme.colors.text,
    fontWeight: '900',
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.text,
  },
  lessonDuration: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  lessonChevron: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '900',
  },
  lessonTextDisabled: {
    color: theme.colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  pricePill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  enrollBtn: {
    flex: 1,
  },
});

