import { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Minor } from './pages/Minor';
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const minor = path === '/ai-minor';
  const admin = path === '/admin';
  const known = minor || admin || path === '/';
  useEffect(() => {
    document.title = admin ? 'Admin — Sierd van Wilsum' : minor ? 'Future-proof with AI — Sierd van Wilsum' : known ? 'Sierd van Wilsum — Events, marketing & sport' : 'Pagina niet gevonden — Sierd van Wilsum';
  }, [minor, known, admin]);
  return <div id="top"><a className="skip-link" href="#main">Ga naar inhoud</a><Header minor={minor} /><main id="main">{admin ? <Suspense fallback={<p className="container" role="status">Admin laden…</p>}><Admin /></Suspense> : minor ? <Minor /> : known ? <Home /> : <section className="not-found container"><p className="eyebrow">404 / Pagina niet gevonden</p><h1>Even de weg kwijt?</h1><a className="button button-dark" href="/">Terug naar home →</a></section>}</main><Footer /></div>;
}
