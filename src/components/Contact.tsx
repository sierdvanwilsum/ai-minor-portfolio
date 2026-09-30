import { useContent } from '../lib/ContentProvider';
import { Arrow } from './Arrow';

export function Contact() {
  const { content: { profile, copy } } = useContent();
  const links = [
    { title: 'E-mail', value: profile.email, href: profile.email ? `mailto:${profile.email}` : '', placeholder: 'E-mailadres volgt' },
    { title: 'LinkedIn', value: profile.linkedin, href: profile.linkedin, placeholder: 'Profiel volgt' },
    { title: 'Curriculum vitae', value: profile.cv, href: profile.cv, placeholder: 'CV volgt' },
  ];
  return <section id="contact" className="contact-section"><div className="container">
    <p className="eyebrow">Contact</p>
    <div className="contact-intro"><h2>Kennis<span>maken?</span></h2><p>{copy.contact}</p></div>
    <div className="contact-links">{links.map(link => link.value ? (
      <a key={link.title} href={link.href} target={link.title === 'E-mail' ? undefined : '_blank'} rel="noopener noreferrer"><span>{link.title}</span><Arrow diagonal /></a>
    ) : <div className="contact-pending" key={link.title}><span>{link.title}<small>{link.placeholder}</small></span><span aria-hidden="true">—</span></div>)}</div>
  </div></section>;
}
