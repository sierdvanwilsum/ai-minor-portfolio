import { z } from 'zod';

const text = z.string().max(30000);
const required = text.trim().min(1, 'Vul dit veld in.');
export const safeUrl = text.refine(value => {
  if (!value) return true;
  if (value.includes('\\') || /[\u0000-\u0020]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}, 'Gebruik een https://-adres of een lokaal pad dat begint met /.');
const image = z.object({ src: safeUrl, alt: required, caption: text.optional() });
const resource = z.object({ label: required, url: safeUrl.refine(v => !!v, 'Vul een link in.') });
const outcomeId = z.enum(['LU1', 'LU2', 'LU3', 'LU4', 'LU5']);
export const showcaseTypes = ['Research Story', 'User Story', 'Learn Story', 'Project', 'Onderzoek', 'Prototype', 'Bewijs', 'Reflectie'] as const;
export const sprintStatuses = ['Afgerond', 'In uitvoering', 'Nog niet gestart'] as const;
const showcase = z.object({
  id: required, type: z.enum(showcaseTypes), title: required, description: text,
  body: z.array(text).optional(), conclusion: text.optional(), reflection: text.optional(),
  date: z.union([z.literal(''), z.iso.date()]).optional(),
  images: z.array(image), documents: z.array(resource), links: z.array(resource),
  tools: z.array(required), learningOutcomes: z.array(outcomeId),
});
const unique = <T,>(items: T[], key: (item: T) => unknown) => new Set(items.map(key)).size === items.length;

export const contentSchema = z.object({
  profile: z.object({
    name: required, photo: safeUrl, email: z.union([z.literal(''), z.email()]), linkedin: safeUrl,
    cv: safeUrl, personalPhoto: safeUrl,
    photoAlt: text, personalPhotoAlt: text,
  }),
  copy: z.object({ heroTitle: required, heroDescription: text, about: z.array(text), minorIntro: text, minorTeaser: text, contact: text }),
  experiences: z.array(z.object({ organization: required, role: text, period: text, description: text, photos: z.array(image).optional() })),
  projects: z.array(z.object({ id: required, title: required, category: text, year: text, image: safeUrl, alt: text, description: text, href: safeUrl.optional(), photos: z.array(image).optional() })).refine(v => unique(v, p => p.id), 'Project-ID’s moeten uniek zijn.'),
  learningOutcomes: z.array(z.object({
    id: outcomeId, title: required, completed: z.number().int().min(0), total: z.number().int().positive(),
  }).refine(v => v.completed <= v.total, 'Behaald mag niet hoger zijn dan het totaal.')).length(5).refine(v => unique(v, x => x.id), 'Elke leeruitkomst moet uniek zijn.'),
  sprints: z.array(z.object({
    id: z.number().int().min(1).max(8), title: required, subtitle: text.optional(), status: z.enum(sprintStatuses),
    learningOutcomes: z.array(outcomeId), topics: z.array(text).optional(), showcases: z.array(showcase),
  })).length(8).refine(v => unique(v, x => x.id), 'Sprintnummers moeten uniek zijn.').refine(v => unique(v.flatMap(s => s.showcases), x => x.id), 'Showcase-ID’s moeten uniek zijn.'),
});
export type SiteContent = z.infer<typeof contentSchema>;

export function parseContent(value: unknown): SiteContent {
  const result = contentSchema.safeParse(value);
  if (!result.success) {
    const first = result.error.issues[0];
    throw new Error(`${first.path.join(' → ')}: ${first.message}`);
  }
  return result.data;
}
