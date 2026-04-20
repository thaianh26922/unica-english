export type AudioTrack = {
  id: string;
  label: string;
  /** Metro `require()` asset id */
  source: number;
};

export const AUDIO_TRACKS: readonly AudioTrack[] = [
  { id: 'audio', label: 'audio.mp3', source: require('./audio.mp3') },
  { id: 'audio2', label: 'audio2.mp3', source: require('./audio2.mp3') },
  {
    id: 'audio2_female',
    label: 'audio2_female.mp3',
    source: require('./audio2_female.mp3'),
  },
] as const;
