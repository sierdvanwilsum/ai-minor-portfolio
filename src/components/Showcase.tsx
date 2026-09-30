import { useEffect, useState } from 'react';
import type { Showcase as ShowcaseData, PortfolioImage } from '../data/types';
import { Photo } from './Photo';
import { Arrow } from './Arrow';

export function Showcase({ showcase, index }: { showcase: ShowcaseData; index: number }) {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    if (!selectedImage) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedImage]);

  return <>
    <article className="showcase" id={showcase.id}>
    <div className="showcase-meta"><p className="eyebrow">{String(index + 1).padStart(2, '0')} / {showcase.type}</p>{showcase.date && <time dateTime={showcase.date}>{new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(showcase.date))}</time>}</div>
    <div className="showcase-content"><h4>{showcase.title}</h4><p className="showcase-description">{showcase.description}</p>
      {showcase.body?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      <div className={showcase.images.length > 1 ? 'showcase-gallery multiple' : 'showcase-gallery'}>
        {showcase.images.length ? showcase.images.map(img => <figure key={img.src}>
          <button className="showcase-image-button" type="button" onClick={() => setSelectedImage(img)} aria-label={`Vergroot afbeelding: ${img.alt}`}>
            <Photo src={img.src} alt={img.alt} />
            <span className="photo-open" aria-hidden="true">Vergroot ↗</span>
          </button>
          {img.caption && <figcaption>{img.caption}</figcaption>}
        </figure>) : <Photo alt="" label="Screenshots / beeldmateriaal volgen" />}
      </div>
      {showcase.conclusion && <div className="editorial-note"><p className="eyebrow">Belangrijkste conclusie</p><p>{showcase.conclusion}</p></div>}
      {showcase.reflection && <div className="editorial-note"><p className="eyebrow">Reflectie</p><p>{showcase.reflection}</p></div>}
      <dl className="showcase-facts"><div><dt>Gebruikte tools</dt><dd>{showcase.tools.length ? showcase.tools.join(' / ') : 'Nog toe te voegen'}</dd></div><div><dt>Leeruitkomsten</dt><dd>{showcase.learningOutcomes.length ? showcase.learningOutcomes.join(' · ') : 'Koppeling volgt'}</dd></div></dl>
      <div className="resource-links">{[...showcase.links, ...showcase.documents].map(resource => <a className="text-link" href={resource.url} target="_blank" rel="noopener noreferrer" key={resource.url}>{resource.label}<Arrow diagonal /><span className="sr-only"> (nieuw tabblad)</span></a>)}{!showcase.documents.length && <span className="pending-resource">Bewijsdocument volgt</span>}</div>
    </div>
    </article>
    {selectedImage && <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Vergrote afbeelding" onClick={() => setSelectedImage(null)}>
      <div className="image-lightbox-inner" onClick={event => event.stopPropagation()}>
        <button className="image-lightbox-close" type="button" onClick={() => setSelectedImage(null)} aria-label="Sluit vergrote afbeelding">Sluiten ×</button>
        <img src={selectedImage.src} alt={selectedImage.alt} />
        {selectedImage.caption && <p>{selectedImage.caption}</p>}
      </div>
    </div>}
  </>;
}
