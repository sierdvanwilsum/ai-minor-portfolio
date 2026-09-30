import { profile, experiences, projects } from './portfolio';
import { sprints } from './sprints';
import { learningOutcomes } from './learningOutcomes';
import { parseContent } from '../lib/contentSchema';

export const defaultContent = parseContent({
  profile: { ...profile, photoAlt: 'Portret van Sierd van Wilsum', personalPhotoAlt: 'Samen op een festival, een moment uit mijn vrije tijd' },
  copy: {
    heroTitle: 'Sportmanagement,\nevents & marketing.',
    heroDescription: 'Ik ben Sierd. Student Sportkunde en actief binnen events en marketing, het liefst midden in de uitvoering.',
    about: [
      'Ik studeer Sport Management & Ondernemen / Sportkunde aan de Hogeschool van Amsterdam. Ik ben praktisch ingesteld, sociaal en neem graag verantwoordelijkheid. Ik werk het liefst aan evenementen, marketing en merkactivaties die uiteindelijk echt zichtbaar worden.',
      'Buiten mijn studie en werk voetbal ik bij BFC, bezoek ik graag festivals en ontdek ik nieuwe plekken. Tijdens de minor Future-proof with AI onderzoek ik hoe AI mijn werk in events en marketing kan ondersteunen.',
    ],
    minorIntro: 'Tijdens mijn minor onderzoek ik hoe AI mijn toekomstige werk binnen evenementen en marketing verandert. In acht sprints onderzoek, test en bouw ik verschillende toepassingen.',
    minorTeaser: 'In acht sprints onderzoek, test en bouw ik AI-toepassingen voor events en marketing.',
    contact: 'Voor stages, projecten en samenwerkingen.',
  },
  experiences, projects, sprints, learningOutcomes,
});
