import React, { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { RandomRangeAnimatedSprite } from '../../RandomRangeAnimatedSprite';

export type TalkingSpriteProps = {
  frames: readonly any[];
  isActive: boolean;
  frameMs?: number;
  /** Start index for the sequential part (middle). Default 10. */
  middleStartIndex?: number;
  /** Portion of frames used for sequential middle (0..1). Default 0.8 */
  middleEndRatio?: number;
  /** How many last frames to loop/randomize in end phase. Default 5 */
  endTailCount?: number;
  /** If true, middle phase randomizes; default false for sequential. */
  randomizeMiddle?: boolean;
  /** If true, end phase randomizes; default true. */
  randomizeEnd?: boolean;
  style?: StyleProp<ViewStyle>;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const TalkingSprite = memo(function TalkingSprite({
  frames,
  isActive,
  frameMs = 60,
  middleStartIndex = 10,
  middleEndRatio = 0.8,
  endTailCount = 5,
  randomizeMiddle = false,
  randomizeEnd = true,
  style,
}: TalkingSpriteProps) {
  const len = frames.length;

  const middleEndIndex = useMemo(() => {
    if (len <= 0) return 0;
    const idx = Math.floor(len * clamp(middleEndRatio, 0, 1)) - 1;
    return clamp(idx, 0, len - 1);
  }, [len, middleEndRatio]);

  const middleStart = useMemo(() => {
    if (len <= 0) return 0;
    return clamp(middleStartIndex, 0, len - 1);
  }, [len, middleStartIndex]);

  const endStart = useMemo(() => {
    if (len <= 0) return 0;
    const tail = Math.max(1, Math.floor(endTailCount));
    return clamp(len - tail, 0, len - 1);
  }, [endTailCount, len]);

  const endEnd = useMemo(() => (len <= 0 ? 0 : len - 1), [len]);

  return (
    <View style={[styles.container, style]}>
      <RandomRangeAnimatedSprite
        isPlaying
        frames={frames}
        frameMs={frameMs}
        phase={isActive ? 'middle' : 'end'}
        randomizeMiddle={randomizeMiddle}
        randomizeEnd={randomizeEnd}
        middleRange={{ start: middleStart, end: middleEndIndex }}
        endRange={{ start: endStart, end: endEnd }}
        style={styles.sprite}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sprite: {
    width: 110,
    height: 110,
  },
});

