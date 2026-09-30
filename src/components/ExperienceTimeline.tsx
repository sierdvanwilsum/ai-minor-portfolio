import { useContent } from '../lib/ContentProvider';
import { Photo } from './Photo';

export function ExperienceTimeline() {
  const { content: { experiences } } = useContent();
  return <div className="timeline">
    {experiences.map(experience => <article className="experience" key={experience.organization}>
      <span className="timeline-dot" aria-hidden="true" />
      <p className="eyebrow experience-role">{experience.role}</p>
      <h3>{experience.organization}</h3>
      <p>{experience.description}</p>
      {experience.period && <span className="period">{experience.period}</span>}
      {experience.photos && <div className="experience-photos">
        {experience.photos.map(photo => <a key={photo.src} href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt} — volledige foto (nieuw tabblad)`}>
          <Photo src={photo.src} alt={photo.alt} />
        </a>)}
      </div>}
    </article>)}
  </div>;
}
