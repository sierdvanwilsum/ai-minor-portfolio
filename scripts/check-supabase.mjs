import { readFileSync } from 'node:fs';

const values = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(line => /^[A-Z_]+=/.test(line)).map(line => {
  const separator = line.indexOf('=');
  return [line.slice(0, separator), line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const url = values.VITE_SUPABASE_URL;
const key = values.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) { console.log('Configuratie ontbreekt: sla de URL en publishable key op in .env.local.'); process.exit(1); }
if (!key.startsWith('sb_publishable_')) { console.log('Ongeschikte key: gebruik een sb_publishable_-key.'); process.exit(1); }
try {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('URL moet https gebruiken.');
  const response = await fetch(`${parsed.origin}/auth/v1/settings`, { headers: { apikey: key }, signal: AbortSignal.timeout(10000) });
  console.log(`Supabase Auth bereikbaar: HTTP ${response.status}`);
  if (!response.ok) process.exit(1);
  const content = await fetch(`${parsed.origin}/rest/v1/portfolio_content?select=id,version&limit=1`, { headers: { apikey: key }, signal: AbortSignal.timeout(10000) });
  const result = await content.json();
  console.log(`Portfolio-database: HTTP ${content.status}`);
  console.log(content.ok ? `Gepubliceerde records: ${result.length}` : `Databasecode: ${result.code || 'onbekend'} (mogelijk moet het SQL-bestand nog worden uitgevoerd).`);
  if (!content.ok) process.exitCode = 1;
} catch (error) {
  console.log(`Verbindingscontrole mislukt: ${error.cause?.code || error.name}.`);
  process.exitCode = 1;
}
