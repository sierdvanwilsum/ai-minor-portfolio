import type { Sprint } from './types';

export const sprints: Sprint[] = [
  {
    id: 1,
    title: 'Sprint 1',
    subtitle: 'AI-impact, vibe coding & portfolio',
    status: 'Afgerond',
    learningOutcomes: ['LU1', 'LU4', 'LU5'],
    showcases: [
      {
        id: 'ai-impact-eventproductie',
        type: 'Research Story',
        title: 'AI-impact op eventproductie',
        description: 'Onderzoek naar hoe AI het werk van eventproducenten verandert en welke nieuwe vaardigheden belangrijk worden.',
        conclusion: 'AI vervangt de eventproducent niet, maar ondersteunt vooral werkzaamheden waarbij informatie wordt geschreven, gestructureerd, vergeleken of geanalyseerd. De menselijke rol verschuift meer richting aansturen, controleren en beslissen.',
        images: [], documents: [], links: [],
        tools: ['ChatGPT', 'Claude', 'Perplexity', 'NotebookLM'],
        learningOutcomes: ['LU1', 'LU4', 'LU5'],
      },
      {
        id: 'eerste-portfolio',
        type: 'User Story',
        title: 'Portfolio website',
        description: 'Met AI een eerste portfolio-website gebouwd en via GitHub en Vercel online gezet.',
        images: [], documents: [], links: [],
        tools: ['Google AI Studio', 'GitHub', 'Vercel'],
        learningOutcomes: [],
      },
      {
        id: 'digitaal-dagboek',
        type: 'Learn Story',
        title: 'Vibe-coded digitaal dagboek',
        description: 'Een digitale dagboekapp gebouwd door middel van prompting en vibe coding.',
        images: [], documents: [], links: [],
        tools: ['Google AI Studio', 'GitHub', 'Vercel'],
        learningOutcomes: [],
      },
    ],
  },
  {
    id: 2, title: 'Sprint 2', subtitle: 'Van experiment naar toepassing', status: 'In uitvoering',
    learningOutcomes: [], showcases: [],
    topics: [
      'Codex leren gebruiken',
      'Mijn persoonlijke portfolio opnieuw bouwen',
      'Databases leren begrijpen',
      'Supabase koppelen aan een applicatie',
      'Een digitaal dagboek met database',
      'Onderzoek naar concrete AI-tools voor eventproductie',
      'Bepalen welke AI-workflow ik voor eventproductie wil bouwen',
    ],
  },
  ...Array.from({ length: 6 }, (_, index): Sprint => ({
    id: index + 3, title: `Sprint ${index + 3}`, status: 'Nog niet gestart',
    learningOutcomes: [], showcases: [],
  })),
];
