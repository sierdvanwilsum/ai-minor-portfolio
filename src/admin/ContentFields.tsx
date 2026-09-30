import { useId, useState } from 'react';
import { uploadFile } from '../lib/contentRepository';
import type { EditorField } from './editorFields';

type FieldsProps = { fields: EditorField[]; value: Record<string, unknown>; onChange: (value: Record<string, unknown>) => void; onUpload: (busy: boolean) => void };
export function ContentFields({ fields, value, onChange, onUpload }: FieldsProps) {
  return <div className="admin-fields">{fields.map(field => <ContentField key={field.key} field={field} value={value[field.key]} onChange={next => onChange({ ...value, [field.key]: next })} onUpload={onUpload} />)}</div>;
}
export function ContentField({ field, value, onChange, onUpload }: { field: EditorField; value: unknown; onChange: (value: unknown) => void; onUpload: (busy: boolean) => void }) {
  const id = useId();
  const [uploadError, setUploadError] = useState('');
  if (field.kind === 'array') {
    const items = (value || []) as Record<string, unknown>[];
    return <div className="admin-array"><p className="admin-field-title">{field.label}</p>
      {items.map((item, index) => <details className="admin-item" key={index}>
        <summary>{String(item.title || item.organization || item.label || item.alt || `${field.label} ${index + 1}`)}</summary>
        <ContentFields fields={field.fields!} value={item} onChange={next => onChange(items.map((old, i) => i === index ? next : old))} onUpload={onUpload} />
        {!field.fixed && <div className="admin-item-actions">
          <button type="button" disabled={!index} onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Omhoog ↑</button>
          <button type="button" disabled={index === items.length - 1} onClick={() => { const next = [...items]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}>Omlaag ↓</button>
          <button type="button" onClick={() => { if (window.confirm('Dit onderdeel uit de inhoud verwijderen? Dit wordt pas gepubliceerd na opslaan.')) onChange(items.filter((_, i) => i !== index)); }}>Verwijderen</button>
        </div>}
      </details>)}
      {!field.fixed && field.create && <button className="admin-secondary" type="button" onClick={() => onChange([...items, field.create!()])}>Toevoegen aan {field.label.toLowerCase()} +</button>}
    </div>;
  }
  const stringValue = typeof value === 'string' || typeof value === 'number' ? value : '';
  const media = field.kind === 'image' || field.kind === 'document';
  return <div className="admin-field"><label htmlFor={id}>{field.label}</label>
    {field.kind === 'select' ? <select id={id} value={String(stringValue)} onChange={event => onChange(event.target.value)}>{field.options?.map(option => <option key={option}>{option}</option>)}</select>
      : field.kind === 'lines' || field.kind === 'textarea' ? <textarea id={id} rows={4} value={field.kind === 'lines' ? (Array.isArray(value) ? value.join('\n') : '') : stringValue} onChange={event => onChange(field.kind === 'lines' ? event.target.value.split('\n') : event.target.value)} onBlur={event => { if (field.kind === 'lines') onChange(event.target.value.split('\n').map(v => v.trim()).filter(Boolean)); }} />
      : <input id={id} type={field.kind === 'number' ? 'number' : 'text'} min={field.kind === 'number' ? 0 : undefined} step={field.kind === 'number' ? 1 : undefined} readOnly={field.readOnly} value={stringValue} onChange={event => onChange(field.kind === 'number' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value)} />}
    {media && <div className="admin-upload"><label htmlFor={`${id}-file`}>Of upload een {field.kind === 'image' ? 'afbeelding' : 'document'} (max. 10 MB)</label><input id={`${id}-file`} type="file" accept={field.kind === 'image' ? 'image/jpeg,image/png,image/webp,image/gif' : '.pdf,.txt,.doc,.docx'} onChange={async event => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      setUploadError(''); onUpload(true);
      try { onChange(await uploadFile(file)); }
      catch (error) { setUploadError(error instanceof Error ? error.message : 'Upload mislukt.'); }
      finally { onUpload(false); }
    }} />{uploadError && <p role="alert" className="admin-error">{uploadError}</p>}</div>}
  </div>;
}
