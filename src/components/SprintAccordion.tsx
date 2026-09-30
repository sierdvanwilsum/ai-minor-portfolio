import { useEffect, useRef } from 'react';
import type { Sprint } from '../data/types';
import { Showcase } from './Showcase';

export function SprintAccordion({ sprint }: { sprint: Sprint }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      if (window.location.hash === `#sprint-${sprint.id}` && details.current) {
        details.current.open = true;
        requestAnimationFrame(() => details.current?.scrollIntoView());
      }
    };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, [sprint.id]);
  const state = sprint.status === 'Afgerond' ? 'complete' : sprint.status === 'In uitvoering' ? 'active' : 'upcoming';
  return <details ref={details} className={`sprint sprint-${state}`} id={`sprint-${sprint.id}`}>
    <summary><span className="sprint-number" aria-hidden="true">{String(sprint.id).padStart(2, '0')}</span><span className="sprint-title"><h3>{sprint.title}</h3>{sprint.subtitle && <span>{sprint.subtitle}</span>}</span><span className={`status status-${state}`}><i aria-hidden="true" />{sprint.status}</span><span className="accordion-symbol" aria-hidden="true" /></summary>
    <div className="sprint-body">
      {sprint.learningOutcomes.length > 0 && <p className="sprint-outcomes">Leeruitkomsten deze sprint <strong>{sprint.learningOutcomes.join(' · ')}</strong></p>}
      {sprint.topics && <div className="sprint-topics"><p className="eyebrow">Werk in ontwikkeling</p><h4>Waar ik nu aan werk</h4><p>Voorlopige onderwerpen. De aanpak en resultaten werk ik tijdens deze sprint verder uit.</p><ul>{sprint.topics.map(topic => <li key={topic}>{topic}</li>)}</ul></div>}
      {sprint.showcases.map((showcase, index) => <Showcase key={showcase.id} showcase={showcase} index={index} />)}
      {!sprint.showcases.length && <p className="sprint-empty">{sprint.status === 'Nog niet gestart' ? 'Deze sprint is nog niet gestart. Onderwerpen en showcases volgen.' : 'Er zijn nog geen showcases toegevoegd. Resultaten en bewijsstukken volgen.'}</p>}
    </div>
  </details>;
}
