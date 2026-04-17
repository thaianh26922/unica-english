import React, { memo, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AnimatedSprite from 'react-native-animated-sprite';
import { FRAMES3 } from './frames3/frames';

type Sprite = {
  name: string;
  size: { width: number; height: number };
  animationTypes: string[];
  frames: typeof FRAMES3;
  animationIndex: (type: string) => number[];
};

const SOURCE_SIZE = { width: 1920, height: 1080 } as const;

const SEQUENCE_SPRITE_3: Sprite = {
  name: 'frames3-sequence',
  size: SOURCE_SIZE,
  animationTypes: ['PLAY'],
  frames: FRAMES3,
  animationIndex: () => Array.from({ length: FRAMES3.length }, (_, i) => i),
};

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
  const fps = useMemo(() => {
    const frameMs = Number.isFinite(speed) && speed > 0 ? speed : 60;
    return 1000 / frameMs;
  }, [speed]);

  const size = useMemo(() => {
    const width = 260;
    const height = Math.round((width * SOURCE_SIZE.height) / SOURCE_SIZE.width);
    return { width, height };
  }, []);

  const sequence = useMemo(
    () => Array.from({ length: FRAMES3.length }, (_, i) => i),
    [],
  );

  const key = `${isPlaying ? 'play' : 'idle'}:${fps.toFixed(4)}`;

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        <AnimatedSprite
          key={key}
          sprite={SEQUENCE_SPRITE_3}
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

export const Frames3SequenceAnimatedSprite = memo(Frames3SequenceAnimatedSpriteImpl);

