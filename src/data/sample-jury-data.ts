import type { Professor, Procedure } from '@/types/types';

// Sample professors data
export const sampleProfessors: Professor[] = [
  {
    id: 1,
    title: 'професор',
    names: 'Иван Петров',
    science: 4.7,
    university: 'Софийски университет',
    km: 0,
    count: 5,
    preLastDate: '2023-01-15',
    lastDate: '2023-06-20'
  },
  {
    id: 2,
    title: 'доцент',
    names: 'Мария Георгиева',
    science: 4.8,
    university: 'Пловдивски университет',
    km: 120,
    count: 3,
    preLastDate: '2023-02-10',
    lastDate: '2023-05-15'
  },
  {
    id: 3,
    title: 'професор',
    names: 'Петър Стоянов',
    science: 4.6,
    university: 'Варненски свободен университет',
    km: 350,
    count: 7,
    preLastDate: '2023-01-20',
    lastDate: '2023-07-10'
  },
  {
    id: 4,
    title: 'доцент',
    names: 'Анна Димитрова',
    science: 4.9,
    university: 'Технически университет София',
    km: 5,
    count: 2,
    preLastDate: '2023-03-05',
    lastDate: '2023-08-12'
  },
  {
    id: 5,
    title: 'професор',
    names: 'Георги Иванов',
    science: 4.7,
    university: 'Университет за национално и световно стопанство',
    km: 10,
    count: 4,
    preLastDate: '2023-02-28',
    lastDate: '2023-06-30'
  },
  {
    id: 6,
    title: 'доцент',
    names: 'Елена Николова',
    science: 4.8,
    university: 'Софийски университет',
    km: 0,
    count: 3,
    preLastDate: '2023-04-10',
    lastDate: '2023-09-05'
  },
  {
    id: 7,
    title: 'професор',
    names: 'Димитър Василев',
    science: 4.6,
    university: 'Пловдивски университет',
    km: 120,
    count: 6,
    preLastDate: '2023-03-15',
    lastDate: '2023-08-20'
  },
  {
    id: 8,
    title: 'доцент',
    names: 'Светла Петрова',
    science: 4.7,
    university: 'Варненски свободен университет',
    km: 350,
    count: 2,
    preLastDate: '2023-05-20',
    lastDate: '2023-10-10'
  }
];

// Sample procedures data
export const sampleProcedures: Procedure[] = [
  {
    id: 1,
    date: '2023-12-15',
    procedure: 'доктор',
    m1: 1,
    m2: 2,
    m3: 3,
    m4: 4,
    m5: 5,
    m6: null,
    m7: null
  },
  {
    id: 2,
    date: '2023-12-20',
    procedure: 'доцент',
    m1: 2,
    m2: 3,
    m3: 4,
    m4: 5,
    m5: 1,
    m6: null,
    m7: null
  },
  {
    id: 3,
    date: '2023-12-22',
    procedure: 'професор',
    m1: 3,
    m2: 4,
    m3: 5,
    m4: 1,
    m5: 2,
    m6: null,
    m7: null
  },
  {
    id: 4,
    date: '2023-12-28',
    procedure: 'ДН',
    m1: 4,
    m2: 5,
    m3: 1,
    m4: 2,
    m5: 3,
    m6: null,
    m7: null
  },
  {
    id: 5,
    date: '2024-01-05',
    procedure: 'доктор',
    m1: 5,
    m2: 1,
    m3: 2,
    m4: 3,
    m5: 4,
    m6: null,
    m7: null
  },
  {
    id: 6,
    date: '2024-01-10',
    procedure: 'доцент',
    m1: 6,
    m2: 7,
    m3: 8,
    m4: 1,
    m5: 2,
    m6: null,
    m7: null
  },
  {
    id: 7,
    date: '2024-01-15',
    procedure: 'професор',
    m1: 7,
    m2: 8,
    m3: 1,
    m4: 2,
    m5: 3,
    m6: null,
    m7: null
  },
  {
    id: 8,
    date: '2024-01-20',
    procedure: 'ДН',
    m1: 8,
    m2: 1,
    m3: 2,
    m4: 3,
    m5: 4,
    m6: null,
    m7: null
  },
  {
    id: 9,
    date: '2024-01-25',
    procedure: 'доктор',
    m1: 1,
    m2: 3,
    m3: 5,
    m4: 7,
    m5: null,
    m6: null,
    m7: null
  },
  {
    id: 10,
    date: '2024-01-30',
    procedure: 'доцент',
    m1: 2,
    m2: 4,
    m3: 6,
    m4: 8,
    m5: null,
    m6: null,
    m7: null
  }
];
