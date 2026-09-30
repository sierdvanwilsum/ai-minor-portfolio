import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaultContent } from '../data/siteContent';
import { readContent, type ContentRecord } from './contentRepository';
import { supabase } from './supabase';
import type { SiteContent } from './contentSchema';

type ContentState = { content: SiteContent; version: number | null; status: 'local' | 'loading' | 'ready' | 'empty' | 'error'; error: string };
const ContentContext = createContext<ContentState & { reload: () => Promise<void>; publish: (record: ContentRecord) => void } | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({ content: defaultContent, version: null, status: supabase ? 'loading' : 'local', error: '' });
  async function reload() {
    if (!supabase) return;
    setState(previous => ({ ...previous, status: 'loading', error: '' }));
    try {
      const row = await readContent();
      setState({ content: row?.content || defaultContent, version: row?.version ?? null, status: row ? 'ready' : 'empty', error: '' });
    } catch (error) {
      setState(previous => ({ ...previous, status: 'error', error: error instanceof Error ? error.message : 'Verbinding mislukt.' }));
    }
  }
  useEffect(() => { void reload(); }, []);
  return <ContentContext.Provider value={{ ...state, reload, publish: row => setState({ ...row, status: 'ready', error: '' }) }}>{children}</ContentContext.Provider>;
}
export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('ContentProvider ontbreekt.');
  return context;
}
