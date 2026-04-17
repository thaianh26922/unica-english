import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { FRAMES } from './frames/frames';

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

export type FramesSequenceAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Frame duration in ms.
   * Default: 120ms.
   */
  speed?: number;
  style?: StyleProp<ViewStyle>;
};

function FramesSequenceAnimatedSpriteImpl({
  isPlaying,
  speed = 120,
  style,
}: FramesSequenceAnimatedSpriteProps) {
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
    // Keep index in range.
    setFrame(prev => prev % FRAMES.length);
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
      setFrame(prev => (prev + 1) % FRAMES.length);
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
          source={FRAMES[Math.min(frame, FRAMES.length - 1)]}
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

export const FramesSequenceAnimatedSprite = memo(FramesSequenceAnimatedSpriteImpl);

