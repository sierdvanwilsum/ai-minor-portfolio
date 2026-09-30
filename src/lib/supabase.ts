import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || '';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || '';

function configurationError() {
  if (!url || !key) return 'Vul de Project URL en publishable key in .env.local in en herstart de ontwikkelserver.';
  try { if (new URL(url).protocol !== 'https:') return 'De Supabase Project URL moet beginnen met https://.'; }
  catch { return 'De Supabase Project URL is ongeldig.'; }
  if (!key.startsWith('sb_publishable_')) return 'Gebruik een publishable key (sb_publishable_…), geen secret- of service_role-key.';
  return '';
}

export const supabaseConfigurationError = configurationError();
export const supabase = supabaseConfigurationError ? null : createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
