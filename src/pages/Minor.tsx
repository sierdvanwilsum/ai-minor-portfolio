import { LearningDashboard } from '../components/LearningDashboard';
import { SprintAccordion } from '../components/SprintAccordion';
import { useContent } from '../lib/ContentProvider';

export function Minor() {
  const { content: { sprints, copy } } = useContent();
  return <>
    <section className="minor-hero container"><a href="/" className="back-link">← Terug naar mijn portfolio</a><div className="minor-hero-grid"><div><p className="eyebrow accent">AI Minor</p><h1>Future-proof<br />with <span>AI.</span></h1><p>{copy.minorIntro}</p></div></div></section>
    <div className="container"><LearningDashboard /></div>
    <section className="sprints-section section-space container" aria-labelledby="sprints-heading"><div className="sprints-heading"><div><p className="eyebrow">02 / Het proces</p><h2 id="sprints-heading">Mijn sprints<span className="accent">.</span></h2></div><p>Open een sprint voor mijn werk en bewijsstukken.</p></div><div className="sprints">{sprints.map(sprint => <SprintAccordion key={sprint.id} sprint={sprint} />)}</div></section>
    <section className="minor-bottom container"><a className="text-link" href="/#ervaring">Bekijk mijn praktijkervaring <span aria-hidden="true">→</span></a></section>
  </>;
}
