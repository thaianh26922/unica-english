import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type SourceSize = { width: number; height: number };

export type RandomRangeAnimatedSpriteProps = {
  isPlaying: boolean;
  /**
   * Array of require(...) images. Must be stable.
   */
  frames: readonly any[];
  frameMs: number;
  /**
   * When true, picks a random index within active range each tick.
   * Use `randomizeMiddle` / `randomizeEnd` to override per phase; when those
   * are omitted, this value applies to both phases.
   */
  randomize?: boolean;
  /** If set, overrides `randomize` while phase is middle (before timed end). */
  randomizeMiddle?: boolean;
  /** If set, overrides `randomize` while phase is end. */
  randomizeEnd?: boolean;
  /**
   * Inclusive index range to random within while playing (phase A).
   */
  middleRange: { start: number; end: number };
  /**
   * Inclusive index range to random within after timed stop (phase B).
   */
  endRange: { start: number; end: number };
  /**
   * Optional controlled phase. If provided, component follows it.
   */
  phase?: 'middle' | 'end';
  /**
   * Increment to request transition from middleRange → endRange.
   */
  timedStopNonce?: number;
  /**
   * How long to keep running in endRange before stopping (ms).
   * If null/undefined: keep running indefinitely in endRange.
   */
  endPhaseDurationMs?: number | null;
  /**
   * Called when end phase finishes (so parent can set isPlaying=false).
   */
  onEndPhaseComplete?: () => void;
  sourceSize?: SourceSize;
  widthPx?: number;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_SOURCE_SIZE: SourceSize = { width: 1920, height: 1080 };

function clampRange(len: number, range: { start: number; end: number }) {
  if (len <= 0) return { start: 0, end: 0 };
  const s = Math.max(0, Math.min(len - 1, Math.floor(range.start)));
  const e = Math.max(0, Math.min(len - 1, Math.floor(range.end)));
  return s <= e ? { start: s, end: e } : { start: e, end: s };
}

function randInt(min: number, max: number) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function RandomRangeAnimatedSpriteImpl({
  isPlaying,
  frames,
  frameMs,
  randomize = true,
  randomizeMiddle,
  randomizeEnd,
  middleRange,
  endRange,
  phase,
  timedStopNonce = 0,
  endPhaseDurationMs = 900,
  onEndPhaseComplete,
  sourceSize = DEFAULT_SOURCE_SIZE,
  widthPx = 260,
  style,
}: RandomRangeAnimatedSpriteProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTimedStopNonce = useRef(0);
  const phaseRef = useRef<'middle' | 'end'>('middle');
  const prevControlledPhaseRef = useRef<typeof phase>(phase);
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

  const activeRange = useMemo(() => {
    const len = frames.length;
    return phaseRef.current === 'end'
      ? clampRange(len, endRange)
      : clampRange(len, middleRange);
  }, [endRange, frames.length, middleRange]);

  const clearTimers = useMemo(
    () => () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
        endTimerRef.current = null;
      }
    },
    [],
  );

  // Start/stop main interval
  useEffect(() => {
    if (!isPlaying || frames.length <= 0) {
      clearTimers();
      return;
    }

    intervalRef.current = setInterval(() => {
      setFrame(prev => {
        const len = frames.length;
        if (len <= 0) return 0;
        const r =
          phaseRef.current === 'end'
            ? clampRange(len, endRange)
            : clampRange(len, middleRange);

        const useRandom =
          phaseRef.current === 'end'
            ? randomizeEnd ?? randomize
            : randomizeMiddle ?? randomize;

        if (!useRandom) {
          const next = prev + 1;
          return next > r.end ? r.start : next;
        }

        const next = randInt(r.start, r.end);
        // Reduce chance of "stutter" staying same frame.
        if (r.end > r.start && next === prev) {
          return randInt(r.start, r.end);
        }
        return next;
      });
    }, safeFrameMs);

    return () => {
      clearTimers();
    };
  }, [
    clearTimers,
    endRange,
    frames.length,
    isPlaying,
    middleRange,
    randomize,
    randomizeEnd,
    randomizeMiddle,
    safeFrameMs,
  ]);

  // Handle transition to end phase after timed stop
  useEffect(() => {
    if (phase != null) {
      return;
    }
    if (timedStopNonce <= lastTimedStopNonce.current) return;
    lastTimedStopNonce.current = timedStopNonce;
    phaseRef.current = 'end';

    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }

    if (endPhaseDurationMs == null) {
      return;
    }

    endTimerRef.current = setTimeout(() => {
      endTimerRef.current = null;
      onEndPhaseComplete?.();
    }, Math.max(0, Math.round(endPhaseDurationMs)));
  }, [endPhaseDurationMs, onEndPhaseComplete, phase, timedStopNonce]);

  // Reset phase when starting fresh
  useEffect(() => {
    if (!isPlaying) {
      phaseRef.current = 'middle';
    }
  }, [isPlaying]);

  // Controlled phase
  useEffect(() => {
    if (phase == null) return;
    phaseRef.current = phase;
  }, [phase]);

  // When entering middle phase with sequential playback, start from range start.
  useEffect(() => {
    if (phase == null) {
      prevControlledPhaseRef.current = phase;
      return;
    }
    const prev = prevControlledPhaseRef.current;
    prevControlledPhaseRef.current = phase;
    if (phase !== 'middle' || prev === 'middle' || !isPlaying) return;

    const len = frames.length;
    if (len <= 0) return;
    const r = clampRange(len, middleRange);
    const useRandomMiddle = randomizeMiddle ?? randomize;
    if (useRandomMiddle) return;

    setFrame(r.start);
  }, [
    frames.length,
    isPlaying,
    middleRange,
    phase,
    randomize,
    randomizeMiddle,
  ]);

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

export const RandomRangeAnimatedSprite = memo(RandomRangeAnimatedSpriteImpl);

