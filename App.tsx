/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { resolveBundledAudioUri } from './audio/resolveBundledAudioUri';
import { AUDIO_TRACKS, type AudioTrack } from './audio/tracks';
import { FRAMES6 } from './frames6/frames';
import { HUMAN1_FRAMES } from './human1/frames';
import { RandomRangeAnimatedSprite } from './RandomRangeAnimatedSprite';

type SpriteCharacter = {
  id: string;
  label: string;
  frames: readonly any[];
};

const SPRITE_CHARACTERS: readonly SpriteCharacter[] = [
  { id: 'frames6', label: 'Frames6', frames: FRAMES6 },
  { id: 'human1', label: 'Human1', frames: HUMAN1_FRAMES },
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
  const [frames6SecondsText, setFrames6SecondsText] = useState('');
  const [frames6Phase, setFrames6Phase] = useState<'middle' | 'end'>('end');
  const [frames6CharacterId, setFrames6CharacterId] = useState<string>(
    SPRITE_CHARACTERS[0]?.id ?? 'frames6',
  );
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const frames6MiddleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSoundRef = useRef<Sound | null>(null);
  const playbackSessionRef = useRef(0);

  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);

  const disposeActiveSound = useCallback(() => {
    const s = activeSoundRef.current;
    activeSoundRef.current = null;
    if (!s) return;
    try {
      s.stop(() => {
        try {
          s.release();
        } catch {
          // ignore
        }
      });
    } catch {
      try {
        s.release();
      } catch {
        // ignore
      }
    }
  }, []);

  const bumpPlaybackSession = useCallback(() => {
    playbackSessionRef.current += 1;
    return playbackSessionRef.current;
  }, []);

  const selectedFrames6Character = useMemo(() => {
    return SPRITE_CHARACTERS.find(c => c.id === frames6CharacterId) ?? SPRITE_CHARACTERS[0];
  }, [frames6CharacterId]);

  const frames6SequentialEndIndex = useMemo(() => {
    const len = selectedFrames6Character?.frames?.length ?? 0;
    if (len <= 0) return 0;
    return Math.min(len - 1, Math.max(0, Math.floor(len * 0.8) - 1));
  }, [selectedFrames6Character]);

  const clearFrames6MiddleTimer = useCallback(() => {
    if (frames6MiddleTimerRef.current) {
      clearTimeout(frames6MiddleTimerRef.current);
      frames6MiddleTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearFrames6MiddleTimer();
      disposeActiveSound();
    },
    [clearFrames6MiddleTimer, disposeActiveSound],
  );

  const onSubmitFrames6 = useCallback(() => {
    bumpPlaybackSession();
    disposeActiveSound();
    setPlayingAudioId(null);
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
  }, [
    bumpPlaybackSession,
    clearFrames6MiddleTimer,
    disposeActiveSound,
    frames6SecondsText,
  ]);

  const onPlayAudioTrack = useCallback(
    (track: AudioTrack) => {
      const session = bumpPlaybackSession();
      disposeActiveSound();
      clearFrames6MiddleTimer();
      setFrames6Phase('middle');
      setPlayingAudioId(track.id);

      const uri = resolveBundledAudioUri(track.source);
      if (uri == null) {
        setFrames6Phase('end');
        setPlayingAudioId(null);
        return;
      }

      const snd = new Sound(uri, error => {
        if (session !== playbackSessionRef.current) {
          snd.release();
          return;
        }
        if (error) {
          setFrames6Phase('end');
          setPlayingAudioId(null);
          return;
        }
        activeSoundRef.current = snd;
        snd.play(_success => {
          if (session !== playbackSessionRef.current) {
            return;
          }
          activeSoundRef.current = null;
          try {
            snd.release();
          } catch {
            // ignore
          }
          setPlayingAudioId(null);
          setFrames6Phase('end');
        });
      });
    },
    [bumpPlaybackSession, clearFrames6MiddleTimer, disposeActiveSound],
  );

  const onSelectFrames6Character = useCallback(
    (next: string) => {
      if (next === frames6CharacterId) return;
      bumpPlaybackSession();
      disposeActiveSound();
      setPlayingAudioId(null);
      clearFrames6MiddleTimer();
      setFrames6Phase('end');
      setFrames6CharacterId(next);
    },
    [
      bumpPlaybackSession,
      clearFrames6MiddleTimer,
      disposeActiveSound,
      frames6CharacterId,
    ],
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
        <Text style={styles.characterTitle}>Nhân vật</Text>

        <View style={styles.characterButtons}>
          {SPRITE_CHARACTERS.map(c => {
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
            isPlaying
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
                (selectedFrames6Character?.frames?.length ?? 0) - 5,
              ),
              end: (selectedFrames6Character?.frames?.length ?? 1) - 1,
            }}
            phase={frames6Phase}
            style={styles.cat}
          />
        </View>
      </View>

      <View style={[styles.inputBar, bottomPad]}>
        <Text style={styles.inputLabel}>
          Mặc định random trong ~5 frame cuối. Nhập số giây và bấm Submit, hoặc bấm Play một file
          audio: animation chạy tuần tự (middle) trong lúc đó; hết thời gian hoặc hết audio thì quay về
          đoạn cuối (random) như nhau.
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

        <Text style={styles.audioSectionLabel}>Audio</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.audioRow}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        >
          {AUDIO_TRACKS.map(track => {
            const isPlaying = playingAudioId === track.id;
            return (
              <Pressable
                key={track.id}
                accessibilityLabel={`Phát ${track.label}`}
                accessibilityRole="button"
                onPress={() => onPlayAudioTrack(track)}
                style={({ pressed }) => [
                  styles.audioPlayButton,
                  isPlaying && styles.audioPlayButtonActive,
                  pressed && styles.audioPlayButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.audioPlayButtonText,
                    isPlaying && styles.audioPlayButtonTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {isPlaying ? 'Đang phát…' : `Play ${track.label}`}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
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
  audioSectionLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginTop: 4,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  audioPlayButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    maxWidth: 220,
  },
  audioPlayButtonActive: {
    borderColor: '#111827',
    backgroundColor: '#F3F4F6',
  },
  audioPlayButtonPressed: {
    opacity: 0.9,
  },
  audioPlayButtonText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  audioPlayButtonTextActive: {
    color: '#111827',
  },
  stage: {
    alignItems: 'center',
    gap: 10,
    paddingBottom: 18,
  },
  cat: {
    width: 260,
    height: 260,
  },
});

export default App;
