import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Sound from 'react-native-sound';
import { resolveBundledAudioUri } from '../../audio/resolveBundledAudioUri';
import { AUDIO_TRACKS } from '../../audio/tracks';
import { theme } from '../theme/theme';

export const AudioPlayer = memo(function AudioPlayer({
  trackId,
  onEnded,
  onPlayingChange,
}: {
  trackId: string;
  onEnded?: () => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}) {
  const track = useMemo(() => AUDIO_TRACKS.find(t => t.id === trackId) ?? null, [trackId]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle');
  const soundRef = useRef<Sound | null>(null);
  const sessionRef = useRef(0);

  useEffect(() => {
    onPlayingChange?.(status === 'playing' || status === 'loading');
  }, [onPlayingChange, status]);

  const dispose = useCallback(() => {
    sessionRef.current += 1;
    const s = soundRef.current;
    soundRef.current = null;
    if (!s) return;
    try {
      s.stop(() => {
        try {
          s.release();
        } catch {
          // ignore
        }
      });
    } catch {
      try {
        s.release();
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => () => dispose(), [dispose]);

  const onPress = useCallback(() => {
    if (!track) return;
    if (status === 'playing' || status === 'loading') {
      dispose();
      setStatus('idle');
      return;
    }

    const uri = resolveBundledAudioUri(track.source);
    if (!uri) {
      setStatus('error');
      return;
    }

    Sound.setCategory('Playback');
    const session = (sessionRef.current += 1);
    setStatus('loading');

    const snd = new Sound(uri, error => {
      if (session !== sessionRef.current) {
        try {
          snd.release();
        } catch {
          // ignore
        }
        return;
      }
      if (error) {
        setStatus('error');
        return;
      }

      soundRef.current = snd;
      setStatus('playing');
      snd.play(success => {
        if (session !== sessionRef.current) return;
        soundRef.current = null;
        try {
          snd.release();
        } catch {
          // ignore
        }
        setStatus('idle');
        if (success) onEnded?.();
      });
    });
  }, [dispose, onEnded, status, track]);

  const label = useMemo(() => {
    if (!track) return 'Audio not found';
    if (status === 'loading') return 'Loading…';
    if (status === 'playing') return 'Stop';
    if (status === 'error') return 'Try again';
    return 'Play';
  }, [status, track]);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        disabled={!track}
        onPress={onPress}
        style={({ pressed }) => [
          styles.btn,
          (status === 'playing' || status === 'loading') && styles.btnActive,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.btnText}>{label}</Text>
      </Pressable>
      <Text style={styles.trackText} numberOfLines={1}>
        {track?.label ?? '—'}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
  },
  btnActive: {
    backgroundColor: '#111827',
  },
  pressed: {
    opacity: 0.9,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  trackText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});

