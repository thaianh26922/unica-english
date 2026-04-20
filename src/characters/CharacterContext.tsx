import React, { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';
import { getCharacterById, type CharacterId } from './characters';

type CharacterApi = {
  characterId: CharacterId;
  setCharacterId: (id: CharacterId) => void;
};

const CharacterContext = createContext<CharacterApi | null>(null);

export const CharacterProvider = memo(function CharacterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [characterId, setCharacterIdState] = useState<CharacterId>(() => getCharacterById(null).id);

  const setCharacterId = useCallback((id: CharacterId) => {
    setCharacterIdState(id);
  }, []);

  const api = useMemo<CharacterApi>(() => ({ characterId, setCharacterId }), [characterId, setCharacterId]);

  return <CharacterContext.Provider value={api}>{children}</CharacterContext.Provider>;
});

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}

