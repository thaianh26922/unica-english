import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { FRAMES3 } from './frames3/frames';

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

export type Frames3SequenceAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Frame duration in ms.
   * Default: 60ms (inherits app speed default).
   */
  speed?: number;
  style?: StyleProp<ViewStyle>;
};

function Frames3SequenceAnimatedSpriteImpl({
  isPlaying,
  speed = 60,
  style,
}: Frames3SequenceAnimatedSpriteProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [frame, setFrame] = useState(0);

  const frameMs = useMemo(() => {
    const ms = Number.isFinite(speed) && speed > 0 ? speed : 60;
    return ms;
  }, [speed]);

  const size = useMemo(() => {
    const width = 260;
    const height = Math.round((width * SOURCE_SIZE.height) / SOURCE_SIZE.width);
    return { width, height };
  }, []);

  useEffect(() => {
    setFrame(prev => prev % FRAMES3.length);
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
      setFrame(prev => (prev + 1) % FRAMES3.length);
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
          source={FRAMES3[Math.min(frame, FRAMES3.length - 1)]}
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

export const Frames3SequenceAnimatedSprite = memo(Frames3SequenceAnimatedSpriteImpl);

