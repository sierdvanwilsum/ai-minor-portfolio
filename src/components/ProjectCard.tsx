import type { Project } from '../data/portfolio';
import { Arrow } from './Arrow';
import { Photo } from './Photo';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cover = <Photo src={project.image} alt={project.alt} label="Screenshot volgt" />;
  return <article className={`project project-${project.id}`}>
    <div className={`project-image project-image-${index}`}>
      {project.image ? <a className="project-photo-link" href={project.image} target="_blank" rel="noopener noreferrer" aria-label={`Bekijk volledige foto: ${project.title} (nieuw tabblad)`}>{cover}<span className="photo-open" aria-hidden="true">Bekijk foto ↗</span></a> : cover}
    </div>
    <div className="project-meta"><span>{project.category}</span>{project.year && <span>{project.year}</span>}</div>
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    {!!project.photos?.length && <details className="project-gallery">
      <summary>Meer foto's <span aria-hidden="true">({project.photos.length}) +</span></summary>
      <div className="project-gallery-photos">{project.photos.map(photo => <figure key={photo.src}>
        <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt} — open volledige foto (nieuw tabblad)`}><Photo src={photo.src} alt={photo.alt} /></a>
        {photo.caption && <figcaption>{photo.caption}</figcaption>}
      </figure>)}</div>
    </details>}
    {project.href && <a className="text-link" href={project.href}>Bekijk de showcase<Arrow /></a>}
  </article>;
}
