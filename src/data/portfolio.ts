import type { PortfolioImage } from './types';

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  description: string;
  href?: string;
  photos?: PortfolioImage[];
}

interface Experience {
  organization: string;
  role: string;
  period: string;
  description: string;
  photos?: PortfolioImage[];
}

export const profile = {
  name: 'Sierd van Wilsum',
  photo: '/images/profile/sierd-portret.png',
  email: 'Sierdvanwilsum@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sierd-van-wilsum-9378b1240/',
  cv: '/documents/cv-sierd-van-wilsum.pdf',
  personalPhoto: '/images/personal/festival.jpg',
};

export const experiences: Experience[] = [
  { organization: 'Protest Sportswear', role: 'Marketing / junior marketing', period: '', description: 'Werk rond marketing, content, shoots, samenwerkingen, externe partijen en merkactivaties.' },
  { organization: 'LIEF Amsterdam / LOFI', role: 'Events', period: '', description: 'Opbouw, uitvoering en ondersteuning van evenementen. Praktische ervaring achter de schermen.' },
  { organization: 'De Artiesten', role: 'Events', period: '', description: 'Evenementenwerk rond verschillende locaties en producties, waaronder TOBACCO Theater en Hoogtij.' },
  { organization: 'Surfana', role: 'Stage / events', period: '', description: 'Voorbereiden, coördineren en uitvoeren van bedrijfs-, school- en groepsevenementen op het strand.' },
  {
    organization: 'BFC', role: 'Voetbal', period: '', description: 'Voetballen op prestatief niveau.',
    photos: [
      { src: '/images/football/bfc-wedstrijd.jpg', alt: 'Twee BFC-spelers geven elkaar een hand tijdens een wedstrijd' },
      { src: '/images/football/bfc-team.jpeg', alt: 'Teamfoto van BFC op het voetbalveld' },
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'protest', title: 'Mijn stage bij Protest', category: 'Stage / marketing & content', year: '',
    image: '/images/projects/protest.jpg', alt: 'Achter de schermen tijdens een fotoshoot bij mijn stage bij Protest Sportswear',
    description: 'Tijdens mijn stage werkte ik aan content, shoots, samenwerkingen en merkactivaties.',
    photos: [
      { src: '/images/projects/protest-kantoor.jpg', alt: 'Aan tafel op het kantoor van Protest, met een presentatie op het scherm' },
      { src: '/images/profile/sierd.jpg', alt: 'Sierd met een kleurenkaart tijdens een fotoshoot bij Protest' },
    ],
  },
  {
    id: 'surfana', title: 'Beach-events bij Surfana', category: 'Events & coördinatie', year: '',
    image: '/images/projects/surfana.jpg', alt: 'Uitleg aan een groep tijdens een strandactiviteit bij Surfana',
    description: 'Voorbereiden, coördineren en uitvoeren van evenementen voor bedrijven, scholen en groepen.',
    photos: [{ src: '/images/events/surfana-opbouw.jpg', alt: 'Met een bolderkar materiaal vervoeren langs de volleybalvelden op het strand bij Surfana' }],
  },
  {
    id: 'lofi-diner', title: 'Een eigen diner bij LOFI', category: 'Eigen initiatief / events', year: '',
    image: '/images/projects/lofi-diner.jpg', alt: 'Gasten aan een lange gedekte tafel met kaarsen tijdens mijn eigen diner bij LOFI',
    description: 'Een eigen diner georganiseerd bij LOFI.',
  },
  { id: 'portfolio', title: 'Mijn eerste AI-portfolio', category: 'AI & web', year: '', image: '', alt: '', description: 'Een eerste portfolio-website gebouwd met Google AI Studio en online gezet via GitHub en Vercel.', href: '/ai-minor#sprint-1' },
  { id: 'dagboek', title: 'Een digitaal dagboek', category: 'AI & prototype', year: '', image: '', alt: '', description: 'Een digitale dagboekapp, gebouwd door middel van prompting en vibe coding.', href: '/ai-minor#sprint-1' },
];
