import { Arrow } from '../components/Arrow';
import { Contact } from '../components/Contact';
import { ExperienceTimeline } from '../components/ExperienceTimeline';
import { Photo } from '../components/Photo';
import { SectionHeading } from '../components/SectionHeading';
import { ProjectCard } from '../components/ProjectCard';
import { useContent } from '../lib/ContentProvider';

export function Home() {
  const { content: { profile, projects, copy } } = useContent();
  const [firstName, ...lastName] = profile.name.split(/\s+/);
  return <>
    <section className="hero container" aria-labelledby="hero-heading">
      <h1 id="hero-heading">{firstName.toUpperCase()} <span>{lastName.join(' ').toUpperCase()}<span className="name-dot">.</span></span></h1>
      <div className="hero-grid">
        <div className="hero-copy">
          <h2>{copy.heroTitle}</h2>
          <p className="hero-description">{copy.heroDescription}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#ervaring">Bekijk mijn ervaring<Arrow /></a>
            <a className="text-link" href="#projecten">Bekijk mijn projecten<Arrow /></a>
          </div>
        </div>
        <div className="hero-portrait">
          <Photo src={profile.photo} alt={profile.photoAlt} label="Portret volgt" priority />
        </div>
      </div>
    </section>

    <section className="about-section section-space" id="over-mij">
      <div className="container about-grid">
        <div className="about-personal">
          <SectionHeading label="Persoonlijk">Over mij</SectionHeading>
          <div className="personal-photo">
            <a href={profile.personalPhoto} target="_blank" rel="noopener noreferrer" aria-label="Bekijk festivalfoto op volledig formaat (nieuw tabblad)">
              <Photo src={profile.personalPhoto} alt={profile.personalPhotoAlt} label="Festivalfoto volgt" />
            </a>
          </div>
        </div>
        <div className="about-copy">
          <p className="interest-line">EVENTS × MARKETING × SPORT</p>
          {copy.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </section>

    <section className="experience-section section-space container" id="ervaring">
      <div className="experience-layout">
        <SectionHeading label="Werk & sport">Ervaring</SectionHeading>
        <ExperienceTimeline />
      </div>
    </section>

    <section className="projects-section section-space" id="projecten">
      <div className="container">
        <div className="projects-heading"><SectionHeading label="Selected work">Projecten</SectionHeading></div>
        <div className="project-grid">
          {projects.slice(0, 4).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      </div>
    </section>

    <section className="minor-teaser container" aria-labelledby="minor-teaser-heading">
      <div className="minor-teaser-copy">
        <p className="eyebrow">AI Minor</p>
        <h2 id="minor-teaser-heading">Future-proof with AI</h2>
        <p>{copy.minorTeaser}</p>
      </div>
      <a className="text-link" href="/ai-minor">Bekijk mijn minor<Arrow /></a>
    </section>
    <Contact />
  </>;
}
