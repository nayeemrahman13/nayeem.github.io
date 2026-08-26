import { photos, projects } from './content';

function Rest() {
  return (
    <div className="finder-rest">
      <h1>
        <span>Nayeem</span>
        <span>Rahman</span>
      </h1>
      <p className="lede">Tinkerer and product manager.</p>
    </div>
  );
}

function About() {
  return (
    <div className="finder-copy">
      <h2>Memory and connection</h2>
      <p>
        I like building things that focus on memories and connection, usually through code and
        photography.
      </p>
    </div>
  );
}

function Work() {
  return (
    <div className="finder-copy">
      <h2>Things I’ve been building</h2>
      <ol className="finder-list">
        {projects.map((project) => {
          const Title = project.href ? 'a' : 'span';
          const titleProps = project.href
            ? { href: project.href, target: '_blank', rel: 'noreferrer' }
            : {};
          return (
            <li key={project.name}>
              <Title className={project.href ? 'finder-link' : undefined} {...titleProps}>
                {project.name}
              </Title>
              <p>{project.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Photos() {
  return (
    <div className="finder-copy">
      <h2>Places that stayed with me</h2>
      <ul className="finder-photos">
        {photos.map((photo) => (
          <li key={photo.place}>
            <div className={`photo-chip tone-${photo.tone}`} aria-hidden="true" />
            <div>
              <h3>{photo.place}</h3>
              <p>{photo.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Contact() {
  return (
    <div className="finder-copy finder-contact">
      <h2>Want to talk?</h2>
      <p>Collaboration, a walk, or just a hello. I’m around.</p>
      <a className="finder-email" href="mailto:nayeemr613@gmail.com">
        nayeemr613@gmail.com
      </a>
      <p className="finder-foot">nayeem.nyc</p>
    </div>
  );
}

const PANELS = {
  rest: Rest,
  about: About,
  work: Work,
  photos: Photos,
  contact: Contact,
};

export default function Viewfinder({ stop }) {
  const Panel = PANELS[stop.id] ?? Rest;
  return (
    <div className="viewfinder-panel" data-stop={stop.id}>
      <Panel />
    </div>
  );
}
