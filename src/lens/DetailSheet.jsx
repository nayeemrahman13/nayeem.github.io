import { useEffect, useRef } from 'react';
import { about, photos, projects, subjects } from './content';
import { exposure, frameNumber } from './readout';

function About() {
  return <p>{about}</p>;
}

function Work() {
  return (
    <ol className="sheet-list">
      {projects.map((project) => {
        const Title = project.href ? 'a' : 'span';
        const titleProps = project.href
          ? { href: project.href, target: '_blank', rel: 'noreferrer' }
          : {};
        return (
          <li key={project.name}>
            <Title className={project.href ? 'sheet-link' : 'sheet-name'} {...titleProps}>
              {project.name}
            </Title>
            <p>{project.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Photos() {
  return (
    <ul className="sheet-photos">
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
  );
}

function Contact() {
  return (
    <>
      <p>Collaboration, a walk, or just a hello. I’m around.</p>
      <a className="sheet-email" href="mailto:nayeemr613@gmail.com">
        nayeemr613<wbr />@gmail.com
      </a>
      <p className="sheet-foot">nayeem.nyc</p>
    </>
  );
}

const DETAILS = {
  about: About,
  work: Work,
  photos: Photos,
  contact: Contact,
};

export default function DetailSheet({ stop, open, onClose }) {
  const dialogRef = useRef(null);
  const Body = DETAILS[stop.id];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && Body && !dialog.open) dialog.showModal();
    if ((!open || !Body) && dialog.open) dialog.close();
  }, [open, Body]);

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog element itself can only come from the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {Body ? (
        <div className="sheet-inner">
          <header className="sheet-head">
            <p className="sheet-spec">
              <span>{exposure(stop)}</span>
              <span>{frameNumber(stop)}</span>
            </p>
            <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </header>
          <h2 id="sheet-title">{subjects[stop.id].title}</h2>
          <div className="sheet-body">
            <Body />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
