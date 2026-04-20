export type Course = {
  id: string;
  title: string;
  subtitle: string;
  lessons: number;
  levelLabel: string;
  rating: number;
  durationLabel: string;
};

export const TOP_PICK = {
  title: 'Discover Top Picks',
  bigNumber: '+100',
  subtitle: 'lessons',
  cta: 'Explore more',
} as const;

export const POPULAR_COURSES: readonly Course[] = [
  {
    id: 'figma-ui',
    title: 'English Master Class',
    subtitle: 'UI Design (28 lessons)',
    lessons: 28,
    levelLabel: 'Beginner',
    rating: 4.9,
    durationLabel: '6h 30min',
  },
  {
    id: 'ux-web',
    title: 'Web Design for English',
    subtitle: 'UX Design (46 lessons)',
    lessons: 46,
    levelLabel: 'Advanced',
    rating: 4.6,
    durationLabel: '8h 28min',
  },
] as const;

export const SEARCH_RESULTS: readonly Course[] = [
  {
    id: 'mobile-ui-essentials',
    title: 'Mobile Speaking Essentials',
    subtitle: 'Intermediate / 28 lessons',
    lessons: 28,
    levelLabel: 'Intermediate',
    rating: 4.9,
    durationLabel: '6h 30min',
  },
  {
    id: 'ui-animation',
    title: 'Pronunciation Basics',
    subtitle: 'Beginner / 24 lessons',
    lessons: 24,
    levelLabel: 'Beginner',
    rating: 4.8,
    durationLabel: '3h 42min',
  },
  {
    id: 'web-ui-best',
    title: 'Web English Best Practices',
    subtitle: 'Advanced / 46 lessons',
    lessons: 46,
    levelLabel: 'Advanced',
    rating: 4.6,
    durationLabel: '8h 28min',
  },
] as const;

