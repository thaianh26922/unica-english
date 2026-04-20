import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AudioPlayer } from '../components/AudioPlayer';
import { Card, PillButton, Screen } from '../components/Ui';
import { COURSES } from '../data/english';
import { FRAMES6 } from '../../frames6/frames';
import { HUMAN1_FRAMES } from '../../human1/frames';
import { RandomRangeAnimatedSprite } from '../../RandomRangeAnimatedSprite';
import { useProgress } from '../progress/ProgressContext';
import { theme } from '../theme/theme';
import type { CourseStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CourseStackParamList, 'lesson'>;

export const LessonScreen = memo(function LessonScreen({ route, navigation }: Props) {
  const { courseId, lessonId } = route.params;
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [spritePhase, setSpritePhase] = useState<'middle' | 'end'>('end');
  const { isLessonDone, markLessonDone } = useProgress();

  const { course, lesson } = useMemo(() => {
    const c = COURSES.find(x => x.id === courseId) ?? null;
    const l = c?.lessons.find(x => x.id === lessonId) ?? null;
    return { course: c, lesson: l };
  }, [courseId, lessonId]);

  const cards = lesson?.cards ?? [];
  const safeIndex = Math.min(cardIndex, Math.max(cards.length - 1, 0));
  const card = cards[safeIndex];
  const completed = isLessonDone(courseId, lessonId);

  const spriteFrames = useMemo(() => {
    // Pick a more "human" sprite for speaking lessons.
    return courseId === 'daily-speaking' ? HUMAN1_FRAMES : FRAMES6;
  }, [courseId]);

  const spriteSequentialEndIndex = useMemo(() => {
    const len = spriteFrames.length;
    if (len <= 0) return 0;
    return Math.min(len - 1, Math.max(0, Math.floor(len * 0.8) - 1));
  }, [spriteFrames.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setCardIndex(i => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setCardIndex(i => Math.min(cards.length - 1, i + 1));
  }, [cards.length]);

  const onMarkComplete = useCallback(() => {
    markLessonDone(courseId, lessonId);
  }, [courseId, lessonId, markLessonDone]);

  if (!course || !lesson) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Lesson not found</Text>
          <PillButton label="Go back" onPress={() => navigation.goBack()} />
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
          <View style={styles.flex1}>
            <Text style={styles.topTitle} numberOfLines={1}>
              {lesson.title}
            </Text>
            <Text style={styles.topSubtitle} numberOfLines={1}>
              {course.title} • {lesson.durationLabel}
            </Text>
          </View>
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>
              {cards.length === 0 ? '0/0' : `${safeIndex + 1}/${cards.length}`}
            </Text>
          </View>
        </View>

        <Card style={styles.spriteCard}>
          <View style={styles.spriteRow}>
            <View style={styles.spriteStage}>
              <RandomRangeAnimatedSprite
                isPlaying
                frames={spriteFrames}
                frameMs={60}
                randomizeMiddle={false}
                middleRange={{ start: 10, end: spriteSequentialEndIndex }}
                endRange={{
                  start: Math.max(0, spriteFrames.length - 5),
                  end: Math.max(0, spriteFrames.length - 1),
                }}
                phase={spritePhase}
                style={styles.sprite}
              />
            </View>
            <View style={styles.spriteTextCol}>
              <Text style={styles.spriteTitle}>Practice</Text>
              <Text style={styles.spriteSub}>
                {spritePhase === 'middle' ? 'Listening… repeat after audio' : 'Ready when you are'}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.flashCard}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsFlipped(v => !v)}
            style={({ pressed }) => [styles.flashCardInner, pressed && { opacity: 0.95 }]}
          >
            <Text style={styles.cardLabel}>{isFlipped ? 'Meaning' : 'Phrase'}</Text>
            <Text style={styles.cardMain}>{isFlipped ? card?.back : card?.front}</Text>
            {card?.example ? (
              <Text style={styles.cardExample} numberOfLines={2}>
                {card.example}
              </Text>
            ) : null}
            <Text style={styles.tapHint}>Tap to flip</Text>
          </Pressable>
        </Card>

        {card?.audioTrackId ? (
          <Card style={styles.audioCard}>
            <Text style={styles.audioTitle}>Listening</Text>
            <Text style={styles.audioSub}>Play the sample audio, then repeat.</Text>
            <AudioPlayer
              trackId={card.audioTrackId}
              onPlayingChange={isPlaying => setSpritePhase(isPlaying ? 'middle' : 'end')}
              onEnded={() => {
                // When audio ends, advance like finishing a timed step.
                if (safeIndex >= cards.length - 1) {
                  onMarkComplete();
                } else {
                  goNext();
                }
              }}
            />
          </Card>
        ) : null}

        <View style={styles.controlsRow}>
          <PillButton label="Prev" onPress={goPrev} variant="ghost" style={styles.ctrlBtn} />
          <PillButton label="Next" onPress={goNext} variant="primary" style={styles.ctrlBtn} />
        </View>

        <Card style={styles.completeCard}>
          <Text style={styles.completeTitle}>Progress</Text>
          <Text style={styles.completeSub}>
            {completed ? 'Completed! Great job.' : 'Mark this lesson complete when you’re done.'}
          </Text>
          <PillButton
            label={completed ? 'Completed' : 'Mark complete'}
            onPress={onMarkComplete}
            variant={completed ? 'soft' : 'primary'}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 },
  title: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
  topTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  topSubtitle: { marginTop: 2, fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  progressText: { fontSize: 12, fontWeight: '900', color: theme.colors.textMuted },
  spriteCard: { padding: 12 },
  spriteRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  spriteStage: {
    width: 120,
    height: 120,
    borderRadius: 22,
    backgroundColor: '#D7ECFF',
    borderWidth: 1,
    borderColor: '#CFE5FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sprite: { width: 110, height: 110 },
  spriteTextCol: { flex: 1, gap: 6 },
  spriteTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.text },
  spriteSub: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  flashCard: { overflow: 'hidden' },
  flashCardInner: { padding: 18, gap: 10 },
  cardLabel: { fontSize: 12, fontWeight: '900', color: theme.colors.primary },
  cardMain: { fontSize: 22, fontWeight: '900', color: theme.colors.text },
  cardExample: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted },
  tapHint: { marginTop: 10, fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  audioCard: { padding: 16, gap: 8 },
  audioTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.text },
  audioSub: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  controlsRow: { flexDirection: 'row', gap: 12 },
  ctrlBtn: { flex: 1 },
  completeCard: { padding: 16, gap: 10 },
  completeTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.text },
  completeSub: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
});

