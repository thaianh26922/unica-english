import { FRAMES6 } from '../../frames6/frames';
import { HUMAN1_FRAMES } from '../../human1/frames';

export type CharacterId = 'human1' | 'frames6';

export type Character = {
  id: CharacterId;
  label: string;
  frames: readonly any[];
};

export const CHARACTERS: readonly Character[] = [
  { id: 'human1', label: 'Human 1', frames: HUMAN1_FRAMES },
  { id: 'frames6', label: 'Frames6', frames: FRAMES6 },
] as const;

export function getCharacterById(id: CharacterId | string | null | undefined) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}

