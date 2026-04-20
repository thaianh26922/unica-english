export type VocabCard = {
  id: string;
  front: string;
  back: string;
  example?: string;
  /** Track id from `audio/tracks.ts` */
  audioTrackId?: string;
};

export type Lesson = {
  id: string;
  title: string;
  durationLabel: string;
  cards: readonly VocabCard[];
};

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  levelLabel: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  durationLabel: string;
  lessons: readonly Lesson[];
};

export const COURSES: readonly Course[] = [
  {
    id: 'daily-speaking',
    title: 'Daily Speaking Starter',
    subtitle: 'Pronunciation • Listening • 3 lessons',
    levelLabel: 'Beginner',
    rating: 4.9,
    durationLabel: '45min',
    lessons: [
      {
        id: 'greetings',
        title: 'Greetings & Introductions',
        durationLabel: '12:20',
        cards: [
          {
            id: 'hi',
            front: 'Hi! / Hello!',
            back: 'Xin chào!',
            example: 'Hi, nice to meet you.',
            audioTrackId: 'audio',
          },
          {
            id: 'my-name-is',
            front: 'My name is …',
            back: 'Tên tôi là …',
            example: 'My name is An.',
            audioTrackId: 'audio2',
          },
          {
            id: 'nice-to-meet',
            front: 'Nice to meet you.',
            back: 'Rất vui được gặp bạn.',
            example: 'Nice to meet you too.',
            audioTrackId: 'audio2_female',
          },
        ],
      },
      {
        id: 'numbers',
        title: 'Numbers in daily life',
        durationLabel: '15:05',
        cards: [
          { id: 'one', front: 'one', back: 'một', example: 'One coffee, please.' },
          { id: 'two', front: 'two', back: 'hai', example: 'Two tickets.' },
          { id: 'three', front: 'three', back: 'ba', example: 'Three minutes.' },
        ],
      },
      {
        id: 'ordering',
        title: 'Ordering at a café',
        durationLabel: '17:40',
        cards: [
          { id: 'id-like', front: "I'd like …", back: 'Tôi muốn …', example: "I'd like a latte." },
          { id: 'for-here', front: 'For here or to go?', back: 'Uống tại chỗ hay mang đi?' },
          { id: 'to-go', front: 'To go, please.', back: 'Mang đi ạ.', example: 'To go, please.' },
        ],
      },
    ],
  },
  {
    id: 'work-english',
    title: 'Work English Essentials',
    subtitle: 'Emails • Meetings • 2 lessons',
    levelLabel: 'Intermediate',
    rating: 4.8,
    durationLabel: '35min',
    lessons: [
      {
        id: 'emails',
        title: 'Email basics',
        durationLabel: '18:10',
        cards: [
          { id: 'hope-you', front: 'I hope you are well.', back: 'Hy vọng bạn khỏe.' },
          { id: 'follow-up', front: 'Just following up…', back: 'Mình follow up…' },
          { id: 'best-regards', front: 'Best regards,', back: 'Trân trọng,' },
        ],
      },
      {
        id: 'meetings',
        title: 'Meeting phrases',
        durationLabel: '16:50',
        cards: [
          { id: 'agenda', front: "Today's agenda is…", back: 'Chương trình hôm nay là…' },
          { id: 'any-questions', front: 'Any questions?', back: 'Có câu hỏi nào không?' },
          { id: 'wrap-up', front: "Let's wrap up.", back: 'Kết thúc nhé.' },
        ],
      },
    ],
  },
] as const;

