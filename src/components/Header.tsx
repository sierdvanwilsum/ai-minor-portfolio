import { useEffect, useRef, useState } from 'react';

export function Header({ minor }: { minor: boolean }) {
  const admin = window.location.pathname.replace(/\/$/, '') === '/admin';
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  const links = [
    { label: 'Home', href: '/' }, { label: 'Over mij', href: '/#over-mij' },
    { label: 'Ervaring', href: '/#ervaring' }, { label: 'Projecten', href: '/#projecten' },
    { label: 'AI Minor', href: '/ai-minor' }, { label: 'Contact', href: '/#contact' },
    { label: 'Admin', href: '/admin' },
  ];
  return (
    <header className="site-header">
      <div className="header-inner container">
        <a className="wordmark" href="/" aria-label="Sierd van Wilsum — home">SIERD<span>.</span></a>
        <button ref={button} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Sluiten −' : 'Menu +'}</button>
        <nav id="main-navigation" aria-label="Hoofdnavigatie" className={open ? 'navigation is-open' : 'navigation'}>
          {links.map(link => <a key={link.label} href={link.href} onClick={() => setOpen(false)} aria-current={(admin && link.label === 'Admin') || (minor && link.label === 'AI Minor') || (!minor && !admin && link.label === 'Home') ? 'page' : undefined}>{link.label}{link.label === 'Contact' && <span aria-hidden="true"> ↗</span>}</a>)}
        </nav>
      </div>
    </header>
  );
}
