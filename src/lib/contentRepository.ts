import { supabase } from './supabase';
import { parseContent, type SiteContent } from './contentSchema';

export interface ContentRecord { content: SiteContent; version: number }
export async function readContent(): Promise<ContentRecord | null> {
  if (!supabase) throw new Error('Supabase is nog niet ingesteld.');
  const { data, error } = await supabase.from('portfolio_content').select('content, version').eq('id', 'main').abortSignal(AbortSignal.timeout(10000)).maybeSingle();
  if (error) throw new Error(error.code === 'PGRST205' || error.code === '42P01'
    ? 'De databasetabellen ontbreken. Voer eerst het SQL-bestand uit volgens supabase/README.md.'
    : 'De website-inhoud kon niet worden geladen. Controleer de verbinding en databaserechten.');
  return data ? { content: parseContent(data.content), version: data.version } : null;
}

export async function saveContent(content: SiteContent, version: number | null): Promise<ContentRecord> {
  if (!supabase) throw new Error('Supabase is nog niet ingesteld.');
  const validated = parseContent(content);
  const table = supabase.from('portfolio_content');
  const query = version === null
    ? table.insert({ id: 'main', content: validated })
    : table.update({ content: validated }).eq('id', 'main').eq('version', version);
  const { data, error } = await query.select('content, version').single();
  if (error) throw new Error(error.code === 'PGRST116' || error.code === '23505'
    ? 'De inhoud is intussen gewijzigd. Bewaar je tekst en laad de opgeslagen versie opnieuw.'
    : 'Opslaan is niet gelukt. Controleer je verbinding en of je account beheerdersrechten heeft. Je wijzigingen staan nog in het formulier.');
  return { content: parseContent(data.content), version: data.version };
}

export async function uploadFile(file: File) {
  if (!supabase) throw new Error('Supabase is nog niet ingesteld.');
  const types: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'application/pdf': 'pdf', 'text/plain': 'txt', 'application/msword': 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx' };
  if (!types[file.type]) throw new Error('Gebruik JPG, PNG, WebP, GIF, PDF, TXT, DOC of DOCX.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Dit bestand is groter dan 10 MB.');
  const path = `uploads/${crypto.randomUUID()}.${types[file.type]}`;
  const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error('Upload mislukt. Controleer of de mediabucket en beheerdersrechten zijn ingesteld.');
  return supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl;
}
