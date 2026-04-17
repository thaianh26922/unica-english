/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Frames01SequenceAnimatedSprite } from './Frames01SequenceAnimatedSprite';
import { Frames3SequenceAnimatedSprite } from './Frames3SequenceAnimatedSprite';

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
  // Faster frame rate for a more "talking" feel.
  const speed = 60;

  const onToggleTalking = useCallback(() => {
    setIsTalking(prev => !prev);
  }, []);

  const topPad = useMemo(() => ({ paddingTop: safeAreaInsets.top }), [
    safeAreaInsets.top,
  ]);

  return (
    <View style={[styles.container, topPad]}>
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

      {/* <View style={styles.stage}>
        <Text style={styles.title}>frames/ (sequential)</Text>
        <FramesSequenceAnimatedSprite
          isPlaying={isTalking}
          speed={speed}
          style={styles.cat}
        />
        <Text style={styles.caption}>
          frames folder (1 → 27, no random, speed {speed}ms)
        </Text>
      </View> */}

      <View style={styles.stage}>
        {/* <Text style={styles.title}>frames01/ (sequential)</Text> */}
        <Frames01SequenceAnimatedSprite
          isPlaying={isTalking}
          speed={speed}
          style={styles.cat}
        />
        {/* <Text style={styles.caption}>
          frames01 folder (1 → 81, no random, speed {speed}ms)
        </Text> */}
      </View>

      <View style={styles.stage}>
        {/* <Text style={styles.title}>frames3/ (sequential)</Text> */}
        <Frames3SequenceAnimatedSprite
          isPlaying={isTalking}
          speed={speed}
          style={styles.cat}
        />
        {/* <Text style={styles.caption}>
          frames3 folder (1 → 88, no random, speed {speed}ms)
        </Text> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
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
