import React, { createContext, memo, useCallback, useContext, useMemo, useState } from 'react';

type ProgressState = Readonly<Record<string, true>>;

type ProgressApi = {
  isLessonDone: (courseId: string, lessonId: string) => boolean;
  markLessonDone: (courseId: string, lessonId: string) => void;
};

const ProgressContext = createContext<ProgressApi | null>(null);

function key(courseId: string, lessonId: string) {
  return `${courseId}::${lessonId}`;
}

export const ProgressProvider = memo(function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [done, setDone] = useState<ProgressState>({});

  const markLessonDone = useCallback((courseId: string, lessonId: string) => {
    setDone(prev => {
      const k = key(courseId, lessonId);
      if (prev[k]) return prev;
      return { ...prev, [k]: true };
    });
  }, []);

  const isLessonDone = useCallback(
    (courseId: string, lessonId: string) => {
      const k = key(courseId, lessonId);
      return Boolean(done[k]);
    },
    [done],
  );

  const api = useMemo<ProgressApi>(() => ({ isLessonDone, markLessonDone }), [isLessonDone, markLessonDone]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
});

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}

