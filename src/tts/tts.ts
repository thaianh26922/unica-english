import Tts, { type Voice } from 'react-native-tts';

let initialized = false;

export type SpeakOptions = {
  /** BCP-47 like 'en-US' */
  language?: string;
  rate?: number; // 0..1 (platform-dependent)
  pitch?: number;
  iosVoiceId?: string;
};

export async function ensureTts() {
  if (initialized) return;
  initialized = true;
  try {
    await Tts.getInitStatus();
  } catch {
    // On some Android devices this throws when no TTS engine; ignore.
  }
  Tts.setDucking(true);
  // Default english
  Tts.setDefaultLanguage('en-US');
  Tts.setDefaultRate(0.5, true);
}

export async function speak(text: string, opts: SpeakOptions = {}) {
  await ensureTts();
  await Tts.stop();

  if (opts.language) {
    try {
      await Tts.setDefaultLanguage(opts.language);
    } catch {
      // ignore
    }
  }
  if (opts.rate != null) {
    try {
      Tts.setDefaultRate(opts.rate, true);
    } catch {
      // ignore
    }
  }
  if (opts.pitch != null) {
    try {
      Tts.setDefaultPitch(opts.pitch);
    } catch {
      // ignore
    }
  }
  if (opts.iosVoiceId) {
    try {
      const voices = (await Tts.voices()) as Voice[];
      const v = voices.find(x => x.id === opts.iosVoiceId);
      if (v?.id) {
        Tts.setDefaultVoice(v.id);
      }
    } catch {
      // ignore
    }
  }

  Tts.speak(text);
}

