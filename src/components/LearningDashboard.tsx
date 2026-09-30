import { useContent } from '../lib/ContentProvider';

export function LearningDashboard() {
  const { content: { learningOutcomes } } = useContent();
  return <section className="dashboard" aria-labelledby="dashboard-heading">
    <div className="dashboard-title"><p className="eyebrow">01 / Leeruitkomsten</p><h2 id="dashboard-heading">Voortgang per<br />leeruitkomst</h2></div>
    <div className="outcome-list">{learningOutcomes.map(outcome => {
      const completed = Math.max(0, Math.min(outcome.total, outcome.completed));
      return <div className="outcome" key={outcome.id}><div className="outcome-heading"><span className="outcome-id">{outcome.id}</span><label htmlFor={outcome.id}>{outcome.title}</label><span className="outcome-count">{completed} / {outcome.total} <span>behaald</span></span></div><progress id={outcome.id} value={completed} max={outcome.total}>{completed} / {outcome.total}</progress></div>;
    })}</div>
    <div className="dashboard-footnote"><span><strong>08</strong> sprints in totaal</span><span>Minimaal <strong>3 leeruitkomsten</strong> per sprint evalueren</span><span><strong>LU5</strong> komt iedere sprint terug</span></div>
  </section>;
}
