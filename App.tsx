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

type CharacterId = 'frames3' | 'frames01' | 'human' | 'anhdaden';

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
  const [isTalking, setIsTalking] = useState(false);
  const [characterId, setCharacterId] = useState<CharacterId>('frames3');
  const [secondsText, setSecondsText] = useState('');
  const [timedStopNonce, setTimedStopNonce] = useState(0);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Faster frame rate for a more "talking" feel.
  const speed = 60;

  const selectedFrames = useMemo(() => {
    switch (characterId) {
      case 'frames3':
        return FRAMES3;
      case 'frames01':
        return FRAMES01;
      case 'human':
        return HUMAN_FRAMES;
      case 'anhdaden':
        return ANHDADEN_FRAMES;
      default:
        return FRAMES3;
    }
  }, [characterId]);

  const clearAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearAutoStopTimer(), [clearAutoStopTimer]);

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

  const onSelectCharacter = useCallback(
    (next: CharacterId) => {
      if (next === characterId) return;
      clearAutoStopTimer();
      setIsTalking(false);
      setCharacterId(next);
    },
    [characterId, clearAutoStopTimer],
  );

  const characterLabel = useMemo(() => {
    switch (characterId) {
      case 'frames3':
        return 'Nhân vật 1';
      case 'frames01':
        return 'Nhân vật 2';
      case 'human':
        return 'Human';
      case 'anhdaden':
        return 'Anh da den';
      default:
        return 'Nhân vật';
    }
  }, [characterId]);

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
        <View style={styles.characterBar}>
          <Text style={styles.characterTitle}>Đang chọn: {characterLabel}</Text>
          <View style={styles.characterButtons}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectCharacter('frames3')}
              style={[
                styles.characterButton,
                characterId === 'frames3' && styles.characterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.characterButtonText,
                  characterId === 'frames3' && styles.characterButtonTextActive,
                ]}
              >
                NV1
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectCharacter('frames01')}
              style={[
                styles.characterButton,
                characterId === 'frames01' && styles.characterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.characterButtonText,
                  characterId === 'frames01' && styles.characterButtonTextActive,
                ]}
              >
                NV2
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectCharacter('human')}
              style={[
                styles.characterButton,
                characterId === 'human' && styles.characterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.characterButtonText,
                  characterId === 'human' && styles.characterButtonTextActive,
                ]}
              >
                Human
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectCharacter('anhdaden')}
              style={[
                styles.characterButton,
                characterId === 'anhdaden' && styles.characterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.characterButtonText,
                  characterId === 'anhdaden' && styles.characterButtonTextActive,
                ]}
              >
                AnhDD
              </Text>
            </Pressable>
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
            frames={selectedFrames}
            frameMs={speed}
            timedStopNonce={timedStopNonce}
            style={styles.cat}
            stopMode="finishLoopThenFirst"
          />
        </View>
      </View>

      <View style={[styles.inputBar, bottomPad]}>
        <Text style={styles.inputLabel}>Số giây (để trống = chỉ dừng bằng nút)</Text>
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
