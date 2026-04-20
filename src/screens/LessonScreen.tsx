import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, PillButton, Screen } from '../components/Ui';
import { COURSES } from '../data/english';
import { useCharacter } from '../characters/CharacterContext';
import { getCharacterById } from '../characters/characters';
import { TalkingSprite } from '../components/TalkingSprite';
import { ensureTts, speak } from '../tts/tts';
import { useProgress } from '../progress/ProgressContext';
import { theme } from '../theme/theme';
import type { CourseStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<CourseStackParamList, 'lesson'>;

export const LessonScreen = memo(function LessonScreen({ route, navigation }: Props) {
  const { courseId, lessonId } = route.params;
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakPending, setIsSpeakPending] = useState(false);
  const { isLessonDone, markLessonDone } = useProgress();
  const { characterId } = useCharacter();
  const speakSessionRef = useRef(0);

  const { course, lesson } = useMemo(() => {
    const c = COURSES.find(x => x.id === courseId) ?? null;
    const l = c?.lessons.find(x => x.id === lessonId) ?? null;
    return { course: c, lesson: l };
  }, [courseId, lessonId]);

  const cards = lesson?.cards ?? [];
  const safeIndex = Math.min(cardIndex, Math.max(cards.length - 1, 0));
  const card = cards[safeIndex];
  const completed = isLessonDone(courseId, lessonId);

  const spriteFrames = useMemo(() => getCharacterById(characterId).frames, [characterId]);

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

  useEffect(() => {
    ensureTts();
  }, []);

  useEffect(() => {
    const onStart = () => {
      setIsSpeakPending(false);
      setIsSpeaking(true);
    };
    const onFinish = () => {
      setIsSpeakPending(false);
      setIsSpeaking(false);
      const session = speakSessionRef.current;
      // Only auto-advance if this finish belongs to latest request.
      if (session !== 0) {
        speakSessionRef.current = 0;
        if (safeIndex >= cards.length - 1) {
          onMarkComplete();
        } else {
          goNext();
        }
      }
    };
    const onCancel = () => {
      setIsSpeakPending(false);
      setIsSpeaking(false);
      speakSessionRef.current = 0;
    };

    const subStart = (Tts as any).addEventListener('tts-start', onStart);
    const subFinish = (Tts as any).addEventListener('tts-finish', onFinish);
    const subCancel = (Tts as any).addEventListener('tts-cancel', onCancel);
    return () => {
      subStart?.remove?.();
      subFinish?.remove?.();
      subCancel?.remove?.();
    };
  }, [cards.length, goNext, onMarkComplete, safeIndex]);

  const onSpeakPhrase = useCallback(async () => {
    if (!card?.front) return;
    speakSessionRef.current += 1;
    const session = speakSessionRef.current;
    // Optimistic UI: start animation immediately while TTS engine warms up.
    setIsSpeakPending(true);
    // Mark this session as the one that should auto-advance on finish.
    await speak(card.front, { language: 'en-US', rate: 0.5 });
    // If immediately cancelled/replaced, keep latest session only.
    if (session !== speakSessionRef.current) return;
  }, [card?.front]);

  const onStopSpeaking = useCallback(async () => {
    speakSessionRef.current = 0;
    try {
      await Tts.stop();
    } catch {
      // ignore
    }
    setIsSpeakPending(false);
    setIsSpeaking(false);
  }, []);

  const onPressSpeaker = useCallback(() => {
    if (isSpeaking) {
      onStopSpeaking();
      return;
    }
    onSpeakPhrase();
  }, [isSpeaking, onSpeakPhrase, onStopSpeaking]);

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
              <TalkingSprite
                frames={spriteFrames}
                isActive={isSpeaking || isSpeakPending}
                frameMs={60}
                endTailCount={5}
                style={styles.sprite}
              />
            </View>
            <View style={styles.spriteTextCol}>
              <Text style={styles.spriteTitle}>Practice</Text>
              <Text style={styles.spriteSub}>
                {isSpeaking || isSpeakPending ? 'Speaking…' : 'Ready when you are'}
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
            <View style={styles.phraseRow}>
              <View style={styles.flex1}>
                <Text style={styles.cardMain}>{isFlipped ? card?.back : card?.front}</Text>
              </View>
              {!isFlipped ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isSpeaking ? 'Stop speaking' : 'Speak phrase'}
                  onPress={onPressSpeaker}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.speakerButton,
                    pressed && { opacity: 0.9 },
                    isSpeaking && styles.speakerButtonActive,
                  ]}
                >
                  <Ionicons
                    name={isSpeaking ? 'stop-circle-outline' : 'volume-high-outline'}
                    size={22}
                    color={isSpeaking ? '#111827' : theme.colors.primary}
                  />
                </Pressable>
              ) : null}
            </View>
            {card?.example ? (
              <Text style={styles.cardExample} numberOfLines={2}>
                {card.example}
              </Text>
            ) : null}
            <Text style={styles.tapHint}>Tap to flip</Text>
          </Pressable>
        </Card>

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
    backgroundColor: 'transparent',
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
  phraseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speakerButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerButtonActive: {
    backgroundColor: '#F3F4F6',
  },
  cardExample: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted },
  tapHint: { marginTop: 10, fontSize: 12, fontWeight: '700', color: '#94A3B8' },
  controlsRow: { flexDirection: 'row', gap: 12 },
  ctrlBtn: { flex: 1 },
  completeCard: { padding: 16, gap: 10 },
  completeTitle: { fontSize: 14, fontWeight: '900', color: theme.colors.text },
  completeSub: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
});

