import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { HUMAN_FRAMES } from './human_png/frames';

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

export type HumanPngSequenceAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Frame duration in ms.
   * Default: 60ms (inherits app speed default).
   */
  speed?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Increment when playback should stop from a timed run.
   * Behavior: continue to the end of the current loop, advance to frame 0,
   * then stop on frame 0.
   */
  timedStopNonce?: number;
};

function HumanPngSequenceAnimatedSpriteImpl({
  isPlaying,
  speed = 60,
  style,
  timedStopNonce = 0,
}: HumanPngSequenceAnimatedSpriteProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimedStopNonce = useRef(0);
  const finishLoopRequestedRef = useRef(false);
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
    setFrame(prev => prev % HUMAN_FRAMES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (finishLoopRequestedRef.current) {
        // Timed-stop finish loop is running; don't stop the interval here.
        return;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setFrame(prev => (prev + 1) % HUMAN_FRAMES.length);
    }, frameMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [frameMs, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      return;
    }
    if (timedStopNonce <= lastTimedStopNonce.current) return;
    lastTimedStopNonce.current = timedStopNonce;

    finishLoopRequestedRef.current = true;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setFrame(prev => {
          const len = HUMAN_FRAMES.length;
          const safePrev = prev % len;
          const next = (safePrev + 1) % len;

          if (
            finishLoopRequestedRef.current &&
            safePrev === len - 1 &&
            next === 0
          ) {
            finishLoopRequestedRef.current = false;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }

          return next;
        });
      }, frameMs);
    }
  }, [frameMs, isPlaying, timedStopNonce]);

  const safeFrame = Math.min(frame, HUMAN_FRAMES.length - 1);

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        <Image
          source={HUMAN_FRAMES[safeFrame]}
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

export const HumanPngSequenceAnimatedSprite = memo(
  HumanPngSequenceAnimatedSpriteImpl,
);

