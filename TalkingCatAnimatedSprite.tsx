import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AnimatedSprite from 'react-native-animated-sprite';

const FRAMES = [
  require('./anh1.png'),
  require('./anh2.png'),
  require('./anh3.png'),
  require('./anh4.png'),
  require('./anh5.png'),
] as const;

type Sprite = {
  name: string;
  size: { width: number; height: number };
  animationTypes: string[];
  frames: typeof FRAMES;
  animationIndex: (type: string) => number[];
};

const CAT_SPRITE: Sprite = {
  name: 'cat',
  // These are the *source frame* pixel dimensions.
  size: { width: 1408, height: 768 },
  animationTypes: ['TALK', 'IDLE'],
  frames: FRAMES,
  animationIndex: (type: string) => {
    if (type === 'TALK') return [1, 2, 3];
    return [0];
  },
};

export type TalkingCatAnimatedSpriteProps = {
  isTalking: boolean;
  /**
   * Frame duration in ms.
   * Default: 120ms.
   */
  speed?: number;
  style?: StyleProp<ViewStyle>;
};

function TalkingCatAnimatedSpriteImpl({
  isTalking,
  speed = 120,
  style,
}: TalkingCatAnimatedSpriteProps) {
  const fps = useMemo(() => {
    const frameMs = Number.isFinite(speed) && speed > 0 ? speed : 120;
    return 1000 / frameMs;
  }, [speed]);

  const size = useMemo(() => ({ width: 260, height: 260 }), []);
  const animationType = isTalking ? 'TALK' : 'IDLE';
  const [sequence, setSequence] = useState<number[]>(() =>
    animationType === 'TALK' ? [1, 2, 3] : [0],
  );
  const seedRef = useRef(0);

  useEffect(() => {
    if (animationType !== 'TALK') {
      setSequence([0]);
      return;
    }

    // Create a "random-looking" loop sequence using only frames anh2/anh3/anh4.
    // We loop this array forever via the library's loopAnimation.
    const len = 60;
    const next = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 3));
    seedRef.current += 1;
    setSequence(next);
  }, [animationType, fps]);

  // react-native-animated-sprite doesn't reliably restart animation on prop changes,
  // so we remount on these key changes to keep behavior predictable.
  const key = `${animationType}:${fps.toFixed(4)}:${seedRef.current}`;

  return (
    <View style={[styles.container, style]} collapsable={false}>
      <View style={[styles.stage, size]}>
        <AnimatedSprite
          key={key}
          sprite={CAT_SPRITE}
          animationFrameIndex={sequence}
          loopAnimation={isTalking}
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

export const TalkingCatAnimatedSprite = memo(TalkingCatAnimatedSpriteImpl);

