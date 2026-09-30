import { useEffect, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigurationError } from '../lib/supabase';
import { AdminEditor } from '../admin/AdminEditor';
import { LoginForm } from '../admin/LoginForm';
import '../admin/admin.css';

export function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!supabase) { setChecking(false); return; }
    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => { if (active) { setSession(data.session); setChecking(false); if (error) setError('Je sessie kon niet worden gecontroleerd. Probeer opnieuw in te loggen.'); } }).catch(() => { if (active) { setChecking(false); setError('De loginservice is niet bereikbaar.'); } });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => { if (active) { setSession(next); setChecking(false); } });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    setAllowed(false);
    if (!session || !supabase) return;
    let active = true;
    setCheckingAccess(true);
    void supabase.from('portfolio_admins').select('user_id').eq('user_id', session.user.id).abortSignal(AbortSignal.timeout(10000)).maybeSingle().then(({ data, error }) => {
      if (active) { setAllowed(!!data && !error); setCheckingAccess(false); setError(error ? 'Beheerdersrechten konden niet worden gecontroleerd. Controleer de database-inrichting.' : data ? '' : 'Dit account heeft geen beheerdersrechten.'); }
    });
    return () => { active = false; };
  }, [session?.user.id]);
  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) { setError('Uitloggen is niet gelukt. Probeer het opnieuw.'); return; }
    setSession(null); setAllowed(false); setError('');
  }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase) return;
    const form = new FormData(event.currentTarget);
    setError(''); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: String(form.get('email')).trim(), password: String(form.get('password')) });
      if (error) setError('Inloggen is niet gelukt. Controleer je e-mailadres en wachtwoord en of je account is aangemaakt.');
    } catch { setError('De loginservice is niet bereikbaar. Probeer het opnieuw.'); }
    finally { setBusy(false); }
  }
  return <section className="admin-page container"><p className="eyebrow">Portfolio beheren</p><h1>{session ? 'Admin' : 'Admin inloggen'}</h1>
    {supabaseConfigurationError ? <div className="admin-notice" role="alert">{supabaseConfigurationError}</div>
      : checking || checkingAccess ? <p role="status">Toegang controleren…</p>
        : session && allowed ? <>{error && <p className="admin-error" role="alert">{error}</p>}<AdminEditor onSignOut={signOut} /></>
          : session ? <div><p className="admin-error" role="alert">{error || 'Geen toegang.'}</p><button className="admin-secondary" onClick={signOut}>Uitloggen</button></div>
            : <LoginForm busy={busy} error={error} onSubmit={signIn} />}
  </section>;
}
