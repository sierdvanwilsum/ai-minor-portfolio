import type { LearningOutcomeId } from './types';

export const learningOutcomes: { id: LearningOutcomeId; title: string; completed: number; total: number }[] = [
  { id: 'LU1', title: 'AI-impact op toekomstige beroepspraktijk', completed: 1, total: 2 },
  { id: 'LU2', title: 'Praktijkgerichte AI-oplossing', completed: 0, total: 4 },
  { id: 'LU3', title: 'Ethiek en verantwoordelijk AI-gebruik', completed: 0, total: 2 },
  { id: 'LU4', title: 'AI-tools en technieken', completed: 1, total: 4 },
  { id: 'LU5', title: 'Zelfstandig en zelfsturend werken', completed: 1, total: 6 },
];
