import { about, photos, projects } from '../lens/content';

function About() {
  return <p className="print-lede">{about}</p>;
}

function Work() {
  return (
    <ol className="print-list">
      {projects.map((project) => {
        const Title = project.href ? 'a' : 'span';
        const titleProps = project.href
          ? { href: project.href, target: '_blank', rel: 'noreferrer' }
          : {};
        return (
          <li key={project.name}>
            <Title className={project.href ? 'print-link' : 'print-name'} {...titleProps}>
              {project.name}
            </Title>
            <p>{project.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

// Placeholder prints until the real photos are in.
function Photos() {
  return (
    <ul className="print-photos">
      {photos.map((photo) => (
        <li key={photo.place}>
          <figure className="mini-print">
            <div className={`mini-print-image tone-${photo.tone}`} aria-hidden="true" />
            <figcaption>{photo.place}</figcaption>
          </figure>
          <p>{photo.description}</p>
        </li>
      ))}
    </ul>
  );
}

function Contact() {
  return (
    <>
      <p className="print-lede">Collaboration, a walk, or just a hello. I’m around.</p>
      <a className="print-email" href="mailto:nayeemr613@gmail.com">
        nayeemr613<wbr />@gmail.com
      </a>
      <p className="print-foot">nayeem.nyc</p>
    </>
  );
}

const BODIES = {
  about: About,
  work: Work,
  photos: Photos,
  contact: Contact,
};

export default function PrintContent({ stop }) {
  const Body = BODIES[stop.id];
  return Body ? <Body /> : null;
}
