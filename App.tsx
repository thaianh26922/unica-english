/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SequenceAnimatedSprite } from './SequenceAnimatedSprite';
import { FRAMES01 } from './frames01/frames';
import { FRAMES3 } from './frames3/frames';
import { HUMAN_FRAMES } from './human_png/frames';
import { ANHDADEN_FRAMES } from './anhdaden/frames';
import { FRAMES5 } from './frames5/frames';
import { FRAMES6 } from './frames6/frames';
import { ONLYMOUTH_FRAMES } from './onlymouth/frames';
import { RandomRangeAnimatedSprite } from './RandomRangeAnimatedSprite';

type Character = {
  id: string;
  label: string;
  buttonLabel: string;
  frames: readonly any[];
  frameMs: number;
};

type TabId = 'characters' | 'frames6';

type Frames6Character = {
  id: string;
  label: string;
  frames: readonly any[];
};

const FRAMES6_CHARACTERS: readonly Frames6Character[] = [
  { id: 'frames6', label: 'Frames6', frames: FRAMES6 },
  { id: 'onlymouth', label: 'OnlyMouth', frames: ONLYMOUTH_FRAMES },
] as const;

const CHARACTERS: readonly Character[] = [
  { id: 'frames3', label: 'Nhân vật 1', buttonLabel: 'NV1', frames: FRAMES3, frameMs: 60 },
  { id: 'frames01', label: 'Nhân vật 2', buttonLabel: 'NV2', frames: FRAMES01, frameMs: 60 },
  { id: 'human', label: 'Human', buttonLabel: 'Human', frames: HUMAN_FRAMES, frameMs: 60 },
  { id: 'anhdaden', label: 'Anh da den', buttonLabel: 'AnhDD', frames: ANHDADEN_FRAMES, frameMs: 60 },
  { id: 'frames5', label: 'Frames5', buttonLabel: 'F5', frames: FRAMES5, frameMs: 60 },
] as const;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [tabId, setTabId] = useState<TabId>('characters');
  const [isTalking, setIsTalking] = useState(false);
  const [characterId, setCharacterId] = useState<string>(CHARACTERS[0]?.id ?? 'frames3');
  const [secondsText, setSecondsText] = useState('');
  const [timedStopNonce, setTimedStopNonce] = useState(0);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Frames6 tab state
  const [frames6SecondsText, setFrames6SecondsText] = useState('');
  const [frames6Phase, setFrames6Phase] = useState<'middle' | 'end'>('end');
  const [frames6CharacterId, setFrames6CharacterId] = useState<string>(
    FRAMES6_CHARACTERS[0]?.id ?? 'frames6',
  );
  const frames6MiddleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCharacter = useMemo(() => {
    return CHARACTERS.find(c => c.id === characterId) ?? CHARACTERS[0];
  }, [characterId]);

  const selectedFrames6Character = useMemo(() => {
    return FRAMES6_CHARACTERS.find(c => c.id === frames6CharacterId) ?? FRAMES6_CHARACTERS[0];
  }, [frames6CharacterId]);

  const frames6SequentialEndIndex = useMemo(() => {
    const len = selectedFrames6Character?.frames?.length ?? 0;
    if (len <= 0) return 0;
    return Math.min(len - 1, Math.max(0, Math.floor(len * 0.8) - 1));
  }, [selectedFrames6Character]);

  const clearAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const clearFrames6MiddleTimer = useCallback(() => {
    if (frames6MiddleTimerRef.current) {
      clearTimeout(frames6MiddleTimerRef.current);
      frames6MiddleTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearAutoStopTimer(), [clearAutoStopTimer]);
  useEffect(() => () => clearFrames6MiddleTimer(), [clearFrames6MiddleTimer]);

  const onToggleTalking = useCallback(() => {
    if (isTalking) {
      clearAutoStopTimer();
      setIsTalking(false);
      return;
    }

    clearAutoStopTimer();
    setIsTalking(true);

    const normalized = secondsText.trim().replace(',', '.');
    const seconds = parseFloat(normalized);
    if (Number.isFinite(seconds) && seconds > 0) {
      autoStopTimerRef.current = setTimeout(() => {
        autoStopTimerRef.current = null;
        setTimedStopNonce(n => n + 1);
        setIsTalking(false);
      }, Math.round(seconds * 1000));
    }
  }, [isTalking, secondsText, clearAutoStopTimer]);

  const onSubmitFrames6 = useCallback(() => {
    clearFrames6MiddleTimer();

    const normalized = frames6SecondsText.trim().replace(',', '.');
    const seconds = parseFloat(normalized);
    if (!Number.isFinite(seconds) || seconds <= 0) {
      setFrames6Phase('end');
      return;
    }

    setFrames6Phase('middle');
    frames6MiddleTimerRef.current = setTimeout(() => {
      frames6MiddleTimerRef.current = null;
      setFrames6Phase('end');
    }, Math.round(seconds * 1000));
  }, [clearFrames6MiddleTimer, frames6SecondsText]);

  const onSelectCharacter = useCallback(
    (next: string) => {
      if (next === characterId) return;
      clearAutoStopTimer();
      setIsTalking(false);
      setCharacterId(next);
    },
    [characterId, clearAutoStopTimer],
  );

  const onSelectTab = useCallback(
    (next: TabId) => {
      if (next === tabId) return;
      // Stop everything when switching tabs to avoid orphan timers.
      clearAutoStopTimer();
      setIsTalking(false);
      clearFrames6MiddleTimer();
      setFrames6Phase('end');
      setTabId(next);
    },
    [clearAutoStopTimer, clearFrames6MiddleTimer, tabId],
  );

  const onSelectFrames6Character = useCallback(
    (next: string) => {
      if (next === frames6CharacterId) return;
      clearFrames6MiddleTimer();
      setFrames6Phase('end');
      setFrames6CharacterId(next);
    },
    [clearFrames6MiddleTimer, frames6CharacterId],
  );

  const topPad = useMemo(() => ({ paddingTop: safeAreaInsets.top }), [
    safeAreaInsets.top,
  ]);

  const bottomPad = useMemo(
    () => ({ paddingBottom: Math.max(safeAreaInsets.bottom, 12) }),
    [safeAreaInsets.bottom],
  );

  return (
    <View style={[styles.root, topPad]}>
      <View style={styles.main}>
        <View style={styles.tabBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelectTab('characters')}
            style={[
              styles.tabButton,
              tabId === 'characters' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                tabId === 'characters' && styles.tabButtonTextActive,
              ]}
            >
              Characters
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelectTab('frames6')}
            style={[
              styles.tabButton,
              tabId === 'frames6' && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                tabId === 'frames6' && styles.tabButtonTextActive,
              ]}
            >
              Frames6
            </Text>
          </Pressable>
        </View>

        {tabId === 'characters' ? (
          <>
            <View style={styles.characterBar}>
              <Text style={styles.characterTitle}>
                Đang chọn: {selectedCharacter?.label ?? 'Nhân vật'}
              </Text>
              <View style={styles.characterButtons}>
                {CHARACTERS.map(c => {
                  const active = c.id === characterId;
                  return (
                    <Pressable
                      key={c.id}
                      accessibilityRole="button"
                      onPress={() => onSelectCharacter(c.id)}
                      style={[
                        styles.characterButton,
                        active && styles.characterButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.characterButtonText,
                          active && styles.characterButtonTextActive,
                        ]}
                      >
                        {c.buttonLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={onToggleTalking}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>
                {isTalking ? 'Stop talking' : 'Start talking'}
              </Text>
            </Pressable>

            <View style={styles.stage}>
              <SequenceAnimatedSprite
                isPlaying={isTalking}
                frames={selectedCharacter?.frames ?? []}
                frameMs={selectedCharacter?.frameMs ?? 60}
                timedStopNonce={timedStopNonce}
                style={styles.cat}
                stopMode="finishLoopThenFirst"
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.characterTitle}>Frames6</Text>

            <View style={styles.characterButtons}>
              {FRAMES6_CHARACTERS.map(c => {
                const active = c.id === frames6CharacterId;
                return (
                  <Pressable
                    key={c.id}
                    accessibilityRole="button"
                    onPress={() => onSelectFrames6Character(c.id)}
                    style={[
                      styles.characterButton,
                      active && styles.characterButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.characterButtonText,
                        active && styles.characterButtonTextActive,
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.stage}>
              <RandomRangeAnimatedSprite
                isPlaying={tabId === 'frames6'}
                frames={selectedFrames6Character?.frames ?? []}
                frameMs={60}
                randomizeMiddle={false}
                middleRange={{
                  start: 10,
                  end: frames6SequentialEndIndex,
                }}
                endRange={{
                  start: Math.max(
                    0,
                    (selectedFrames6Character?.frames?.length ?? 0) - 10,
                  ),
                  end: (selectedFrames6Character?.frames?.length ?? 1) - 1,
                }}
                phase={frames6Phase}
                style={styles.cat}
              />
            </View>
          </>
        )}
      </View>

      <View style={[styles.inputBar, bottomPad]}>
        {tabId === 'characters' ? (
          <>
            <Text style={styles.inputLabel}>
              Số giây (để trống = chỉ dừng bằng nút)
            </Text>
            <TextInput
              accessibilityLabel="Số giây chạy animation"
              editable={!isTalking}
              keyboardType="decimal-pad"
              onChangeText={setSecondsText}
              placeholder="Ví dụ: 3"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={secondsText}
            />
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>
              Mặc định random trong ~10 frame cuối. Nhập số giây và bấm Submit để chạy tuần tự
              từ đầu tới 80% số frame, hết giờ sẽ quay về đoạn cuối (random).
            </Text>
            <View style={styles.frames6Controls}>
              <TextInput
                accessibilityLabel="Số giây random ở giữa"
                keyboardType="decimal-pad"
                onChangeText={setFrames6SecondsText}
                placeholder="Ví dụ: 3"
                placeholderTextColor="#9CA3AF"
                style={[styles.input, styles.frames6Input]}
                value={frames6SecondsText}
              />
              <Pressable
                accessibilityRole="button"
                onPress={onSubmitFrames6}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                ]}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  characterBar: {
    alignSelf: 'stretch',
    gap: 10,
    paddingVertical: 6,
  },
  tabBar: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  tabButtonActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  tabButtonText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  characterTitle: {
    alignSelf: 'center',
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  characterButtons: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  characterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  characterButtonActive: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },
  characterButtonText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  characterButtonTextActive: {
    color: '#FFFFFF',
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  frames6Controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  frames6Input: {
    flex: 1,
  },
  submitButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stage: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  cat: {
    width: 260,
    height: 260,
  },
  caption: {
    fontSize: 14,
    opacity: 0.8,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
