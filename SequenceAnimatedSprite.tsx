import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type SequenceAnimatedSpriteStopMode = 'immediate' | 'finishLoopThenFirst';

type SourceSize = { width: number; height: number };

export type SequenceAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Array of require(...) images. Must be stable (no recreation per render).
   */
  frames: readonly any[];
  /**
   * Frame duration in ms.
   */
  frameMs: number;
  /**
   * Used to compute aspect ratio (rendered size derives from widthPx).
   */
  sourceSize?: SourceSize;
  /**
   * Render width in px. Height computed from sourceSize ratio.
   */
  widthPx?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Increment when playback should stop from a timed run.
   */
  timedStopNonce?: number;
  stopMode?: SequenceAnimatedSpriteStopMode;
};

const DEFAULT_SOURCE_SIZE: SourceSize = { width: 1920, height: 1080 };

function SequenceAnimatedSpriteImpl({
  isPlaying,
  frames,
  frameMs,
  sourceSize = DEFAULT_SOURCE_SIZE,
  widthPx = 260,
  style,
  timedStopNonce = 0,
  stopMode = 'finishLoopThenFirst',
}: SequenceAnimatedSpriteProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimedStopNonce = useRef(0);
  const finishLoopRequestedRef = useRef(false);
  const [frame, setFrame] = useState(0);

  const safeFrameMs = useMemo(() => {
    const ms = Number.isFinite(frameMs) && frameMs > 0 ? frameMs : 60;
    return Math.round(ms);
  }, [frameMs]);

  const size = useMemo(() => {
    const width = widthPx;
    const height = Math.round((width * sourceSize.height) / sourceSize.width);
    return { width, height };
  }, [sourceSize.height, sourceSize.width, widthPx]);

  useEffect(() => {
    setFrame(prev => {
      const len = frames.length;
      if (len <= 0) return 0;
      return prev % len;
    });
  }, [frames.length]);

  const stopInterval = useMemo(
    () => () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    },
    [],
  );

  useEffect(() => {
    if (!isPlaying) {
      if (finishLoopRequestedRef.current) {
        // Timed-stop finish loop is running; don't stop the interval here.
        return;
      }
      stopInterval();
      return;
    }

    if (frames.length <= 0) {
      stopInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, safeFrameMs);

    return () => stopInterval();
  }, [frames.length, isPlaying, safeFrameMs, stopInterval]);

  useEffect(() => {
    if (isPlaying) return;
    if (timedStopNonce <= lastTimedStopNonce.current) return;
    lastTimedStopNonce.current = timedStopNonce;

    if (frames.length <= 0) {
      setFrame(0);
      return;
    }

    if (stopMode === 'immediate') {
      stopInterval();
      setFrame(0);
      return;
    }

    // finishLoopThenFirst
    finishLoopRequestedRef.current = true;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setFrame(prev => {
          const len = frames.length;
          if (len <= 0) return 0;

          const safePrev = prev % len;
          const next = (safePrev + 1) % len;

          if (
            finishLoopRequestedRef.current &&
            safePrev === len - 1 &&
            next === 0
          ) {
            finishLoopRequestedRef.current = false;
            stopInterval();
            return 0;
          }

          return next;
        });
      }, safeFrameMs);
    }
  }, [frames.length, isPlaying, safeFrameMs, stopInterval, stopMode, timedStopNonce]);

  const safeIndex = Math.min(frame, Math.max(frames.length - 1, 0));

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        {frames.length > 0 ? (
          <Image source={frames[safeIndex]} style={size} resizeMode="contain" />
        ) : null}
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

export const SequenceAnimatedSprite = memo(SequenceAnimatedSpriteImpl);

