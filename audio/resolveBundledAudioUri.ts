import { Image } from 'react-native';

/** Metro `require(id)` → URI string for native modules that expect a path/URL (e.g. react-native-sound 0.13+). */
export function resolveBundledAudioUri(assetModule: number): string | null {
  const resolved = Image.resolveAssetSource(assetModule);
  if (resolved?.uri == null || resolved.uri === '') {
    return null;
  }
  return resolved.uri;
}
