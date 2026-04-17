import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { FRAMES01 } from './frames01/frames';

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

export type Frames01SequenceAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Frame duration in ms.
   * Default: 120ms.
   */
  speed?: number;
  style?: StyleProp<ViewStyle>;
};

function Frames01SequenceAnimatedSpriteImpl({
  isPlaying,
  speed = 120,
  style,
}: Frames01SequenceAnimatedSpriteProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [frame, setFrame] = useState(0);

  const frameMs = useMemo(() => {
    const ms = Number.isFinite(speed) && speed > 0 ? speed : 120;
    return ms;
  }, [speed]);

  const size = useMemo(() => {
    const width = 260;
    const height = Math.round((width * SOURCE_SIZE.height) / SOURCE_SIZE.width);
    return { width, height };
  }, []);

  useEffect(() => {
    setFrame(prev => prev % FRAMES01.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setFrame(prev => (prev + 1) % FRAMES01.length);
    }, frameMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [frameMs, isPlaying]);

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        <Image
          source={FRAMES01[Math.min(frame, FRAMES01.length - 1)]}
          style={size}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    overflow: 'hidden',
  },
});

export const Frames01SequenceAnimatedSprite = memo(Frames01SequenceAnimatedSpriteImpl);

