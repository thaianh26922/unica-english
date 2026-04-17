import React, { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AnimatedSprite from 'react-native-animated-sprite';
import { FRAMES } from './frames/frames';

type Sprite = {
  name: string;
  size: { width: number; height: number };
  animationTypes: string[];
  frames: typeof FRAMES;
  animationIndex: (type: string) => number[];
};

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

const SEQUENCE_SPRITE: Sprite = {
  name: 'frames-sequence',
  size: SOURCE_SIZE,
  animationTypes: ['PLAY'],
  frames: FRAMES,
  animationIndex: () => Array.from({ length: FRAMES.length }, (_, i) => i),
};

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
  const fps = useMemo(() => {
    const frameMs = Number.isFinite(speed) && speed > 0 ? speed : 120;
    return 1000 / frameMs;
  }, [speed]);

  const size = useMemo(() => {
    const width = 260;
    const height = Math.round((width * SOURCE_SIZE.height) / SOURCE_SIZE.width);
    return { width, height };
  }, []);

  const sequence = useMemo(
    () => Array.from({ length: FRAMES.length }, (_, i) => i),
    [],
  );

  // Force remount on play/fps changes for predictable restarts.
  const key = `${isPlaying ? 'play' : 'idle'}:${fps.toFixed(4)}`;

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        <AnimatedSprite
          key={key}
          sprite={SEQUENCE_SPRITE}
          animationFrameIndex={sequence}
          loopAnimation={isPlaying}
          fps={fps}
          coordinates={{ top: 0, left: 0 }}
          size={size}
          draggable={false}
          visible
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

