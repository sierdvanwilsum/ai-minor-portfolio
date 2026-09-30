export type LearningOutcomeId = 'LU1' | 'LU2' | 'LU3' | 'LU4' | 'LU5';
export interface PortfolioImage { src: string; alt: string; caption?: string }
export interface ResourceLink { label: string; url: string }
export interface Showcase {
  id: string;
  type: 'Research Story' | 'User Story' | 'Learn Story' | 'Project' | 'Onderzoek' | 'Prototype' | 'Bewijs' | 'Reflectie';
  title: string;
  description: string;
  body?: string[];
  conclusion?: string;
  reflection?: string;
  date?: string;
  images: PortfolioImage[];
  documents: ResourceLink[];
  links: ResourceLink[];
  tools: string[];
  learningOutcomes: LearningOutcomeId[];
}
export interface Sprint {
  id: number;
  title: string;
  subtitle?: string;
  status: 'Afgerond' | 'In uitvoering' | 'Nog niet gestart';
  learningOutcomes: LearningOutcomeId[];
  topics?: string[];
  showcases: Showcase[];
}
