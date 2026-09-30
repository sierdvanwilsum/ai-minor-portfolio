import { showcaseTypes, sprintStatuses } from '../lib/contentSchema';

export interface EditorField {
  key: string;
  label: string;
  kind?: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'document' | 'array' | 'lines';
  options?: readonly string[];
  fields?: EditorField[];
  create?: () => unknown;
  fixed?: boolean;
  readOnly?: boolean;
}
const imageFields: EditorField[] = [
  { key: 'src', label: 'Afbeelding', kind: 'image' }, { key: 'alt', label: 'Beschrijving van de afbeelding (alt-tekst)' }, { key: 'caption', label: 'Onderschrift (optioneel)' },
];
const images = (key = 'images'): EditorField => ({ key, label: 'Afbeeldingen', kind: 'array', fields: imageFields, create: () => ({ src: '', alt: '', caption: '' }) });
const links = (key: string, label: string, document = false): EditorField => ({ key, label, kind: 'array', fields: [{ key: 'label', label: 'Tekst van de link' }, { key: 'url', label: 'Adres of bestand', kind: document ? 'document' : 'text' }], create: () => ({ label: document ? 'Bekijk bewijsstuk' : 'Bekijk project', url: '' }) });
const outcomes: EditorField = { key: 'learningOutcomes', label: 'Leeruitkomsten (één per regel: LU1 t/m LU5)', kind: 'lines' };
const showcaseFields: EditorField[] = [
  { key: 'id', label: 'Uniek kenmerk' }, { key: 'type', label: 'Type', kind: 'select', options: showcaseTypes },
  { key: 'title', label: 'Titel' }, { key: 'description', label: 'Korte omschrijving', kind: 'textarea' },
  { key: 'body', label: 'Uitgebreide tekst (één alinea per regel)', kind: 'lines' },
  { key: 'conclusion', label: 'Conclusie', kind: 'textarea' }, { key: 'reflection', label: 'Reflectie', kind: 'textarea' },
  { key: 'date', label: 'Datum (JJJJ-MM-DD, optioneel)' }, { key: 'tools', label: 'Tools (één per regel)', kind: 'lines' },
  outcomes, images(), links('documents', 'Documenten', true), links('links', 'Externe links'),
];
export const editorSections: { key: string; label: string; fields: EditorField[] }[] = [
  { key: 'profile', label: 'Profiel & contact', fields: [
    { key: 'name', label: 'Naam' }, { key: 'email', label: 'E-mailadres' }, { key: 'linkedin', label: 'LinkedIn-adres' },
    { key: 'cv', label: 'CV', kind: 'document' }, { key: 'photo', label: 'Portretfoto', kind: 'image' },
    { key: 'photoAlt', label: 'Alt-tekst portret' }, { key: 'personalPhoto', label: 'Persoonlijke foto', kind: 'image' },
    { key: 'personalPhotoAlt', label: 'Alt-tekst persoonlijke foto' },
  ] },
  { key: 'copy', label: 'Teksten', fields: [
    { key: 'heroTitle', label: 'Ondertitel homepage', kind: 'textarea' }, { key: 'heroDescription', label: 'Introductie', kind: 'textarea' },
    { key: 'about', label: 'Over mij (één alinea per regel)', kind: 'lines' },
    { key: 'minorIntro', label: 'Introductie minorpagina', kind: 'textarea' }, { key: 'minorTeaser', label: 'Minorverwijzing homepage', kind: 'textarea' },
    { key: 'contact', label: 'Contacttekst', kind: 'textarea' },
  ] },
  { key: 'experiences', label: 'Ervaring', fields: [
    { key: 'organization', label: 'Organisatie' }, { key: 'role', label: 'Functie' }, { key: 'period', label: 'Periode' },
    { key: 'description', label: 'Beschrijving', kind: 'textarea' }, images('photos'),
  ] },
  { key: 'projects', label: 'Projecten', fields: [
    { key: 'id', label: 'Uniek kenmerk' }, { key: 'title', label: 'Projectnaam' }, { key: 'category', label: 'Categorie' },
    { key: 'year', label: 'Jaar' }, { key: 'description', label: 'Beschrijving', kind: 'textarea' },
    { key: 'image', label: 'Hoofdafbeelding', kind: 'image' }, { key: 'alt', label: 'Alt-tekst hoofdafbeelding' },
    { key: 'href', label: 'Projectlink (optioneel)' }, images('photos'),
  ] },
  { key: 'learningOutcomes', label: 'LU-voortgang', fields: [
    { key: 'id', label: 'Leeruitkomst', readOnly: true }, { key: 'title', label: 'Omschrijving' },
    { key: 'completed', label: 'Behaald', kind: 'number' }, { key: 'total', label: 'Totaal vereist', kind: 'number' },
  ] },
  { key: 'sprints', label: 'Sprints & showcases', fields: [
    { key: 'id', label: 'Sprintnummer', kind: 'number', readOnly: true }, { key: 'title', label: 'Titel' },
    { key: 'subtitle', label: 'Ondertitel' }, { key: 'status', label: 'Status', kind: 'select', options: sprintStatuses },
    outcomes, { key: 'topics', label: 'Voorlopige onderwerpen (één per regel)', kind: 'lines' },
    { key: 'showcases', label: 'Showcases', kind: 'array', fields: showcaseFields, create: () => ({
      id: crypto.randomUUID(), type: 'Project', title: '', description: '', images: [], documents: [], links: [], tools: [], learningOutcomes: [],
    }) },
  ] },
];
export const createExperience = () => ({ organization: '', role: '', period: '', description: '', photos: [] });
export const createProject = () => ({ id: crypto.randomUUID(), title: '', category: '', year: '', image: '', alt: '', description: '', photos: [] });
