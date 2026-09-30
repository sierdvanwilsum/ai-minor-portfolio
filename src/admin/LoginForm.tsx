import { useState, type FormEvent } from 'react';
import { profile } from '../data/portfolio';

export function LoginForm({ busy, error, onSubmit }: { busy: boolean; error: string; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> }) {
  const [showPassword, setShowPassword] = useState(false);
  return <form className="admin-login" onSubmit={onSubmit} aria-busy={busy}>
    <p>Log in om je portfolio, projecten en AI-minor te beheren.</p>
    <label htmlFor="admin-email">E-mailadres</label>
    <input id="admin-email" name="email" type="email" autoComplete="username" defaultValue={profile.email} required disabled={busy} />
    <label htmlFor="admin-password">Wachtwoord</label>
    <div className="admin-password-field">
      <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required disabled={busy} />
      <button type="button" className="admin-password-toggle" aria-controls="admin-password" aria-pressed={showPassword} disabled={busy} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Verbergen' : 'Tonen'}</button>
    </div>
    <button className="button button-dark" disabled={busy}>{busy ? 'Inloggen…' : 'Inloggen'}</button>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <a className="back-link" href="/">← Terug naar mijn portfolio</a>
  </form>;
}
