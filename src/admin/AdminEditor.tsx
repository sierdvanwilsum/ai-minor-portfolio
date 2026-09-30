import { useEffect, useState } from 'react';
import { useContent } from '../lib/ContentProvider';
import { saveContent } from '../lib/contentRepository';
import { parseContent } from '../lib/contentSchema';
import { ContentField, ContentFields } from './ContentFields';
import { editorSections, createExperience, createProject } from './editorFields';

export function AdminEditor({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const { content, version, status, error, publish, reload } = useContent();
  const [draft, setDraft] = useState(content);
  const [baseVersion, setBaseVersion] = useState(version);
  const [section, setSection] = useState('profile');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  useEffect(() => { if (!dirty) { setDraft(content); setBaseVersion(version); } }, [content, version, dirty]);
  useEffect(() => {
    if (!dirty && !uploading) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, uploading]);
  const current = editorSections.find(item => item.key === section)!;
  const value = draft[section as keyof typeof draft];
  const update = (next: unknown) => { setDraft(previous => ({ ...previous, [section]: next })); setDirty(true); setMessage(''); setSaveError(''); };
  const busy = saving || uploading;
  return <div className="admin-editor">
    <div className="admin-toolbar"><a className="text-link" href="/" target="_blank" rel="noopener noreferrer">Bekijk website ↗</a><button className="admin-secondary" disabled={busy} onClick={async () => {
      if (dirty && !window.confirm('Je hebt niet-opgeslagen wijzigingen. Toch uitloggen?')) return;
      await onSignOut();
    }}>Uitloggen</button></div>
    <div className="admin-notice" role="status">{status === 'empty' ? 'De database is klaar. Klik op Opslaan en publiceren om de huidige website-inhoud over te nemen.' : status === 'ready' ? 'Verbonden met Supabase. Opslaan maakt je wijzigingen direct zichtbaar.' : status === 'loading' ? 'Databaseverbinding controleren…' : error || 'Database niet beschikbaar.'}</div>
    <div className="admin-layout"><nav aria-label="Beheeronderdelen" className="admin-tabs">{editorSections.map(item => <button type="button" key={item.key} aria-current={section === item.key ? 'page' : undefined} disabled={busy} onClick={() => setSection(item.key)}>{item.label}</button>)}</nav>
      <form onSubmit={async event => {
        event.preventDefault(); setSaveError(''); setMessage(''); setSaving(true);
        try { const row = await saveContent(parseContent(draft), baseVersion); publish(row); setDraft(row.content); setBaseVersion(row.version); setDirty(false); setMessage('Opgeslagen en gepubliceerd.'); }
        catch (error) { setSaveError(error instanceof Error ? error.message : 'Opslaan mislukt.'); }
        finally { setSaving(false); }
      }}>
        <h2>{current.label}</h2>
        {section === 'projects' && <p className="admin-hint">De eerste vier projecten staan op de homepage. Gebruik Omhoog / Omlaag voor de volgorde.</p>}
        <fieldset disabled={busy}>
          {Array.isArray(value) ? <ContentField field={{ key: section, label: current.label, kind: 'array', fields: current.fields, fixed: section === 'sprints' || section === 'learningOutcomes', create: section === 'projects' ? createProject : createExperience }} value={value} onChange={update} onUpload={setUploading} />
            : <ContentFields fields={current.fields} value={value as Record<string, unknown>} onChange={update} onUpload={setUploading} />}
        </fieldset>
        <div className="admin-save"><button className="button button-dark" disabled={busy || !['ready', 'empty'].includes(status)} type="submit">{saving ? 'Opslaan…' : uploading ? 'Uploaden…' : 'Opslaan en publiceren'}</button><span>{dirty ? 'Niet-opgeslagen wijzigingen' : 'Geen lokale wijzigingen'}</span>
          <button className="admin-secondary" type="button" disabled={busy} onClick={async () => {
            if (dirty && !window.confirm('Je lokale wijzigingen laten vervallen en de opgeslagen versie laden?')) return;
            setDirty(false); setSaveError(''); setMessage(''); await reload();
          }}>Opgeslagen versie laden</button>
        </div>
        {message && <p role="status" className="admin-success">{message}</p>}
        {saveError && <p role="alert" className="admin-error">{saveError}</p>}
      </form>
    </div>
  </div>;
}
