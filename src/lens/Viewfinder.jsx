import { subjects } from './content';

function Rest() {
  const [first, ...rest] = subjects.rest.title.split(' ');
  return (
    <div className="finder-frame finder-rest">
      <h1>
        <span>{first}</span>
        <span>{rest.join(' ')}</span>
      </h1>
      <p className="lede">{subjects.rest.line}</p>
      <p className="finder-hint">Turn the ring to zoom</p>
    </div>
  );
}

function Subject({ stop, onOpen }) {
  return (
    <button
      type="button"
      className="finder-frame finder-subject"
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <span className="subject-title">{subjects[stop.id].title}</span>
      <span className="finder-hint">Look closer</span>
    </button>
  );
}

// Keyed by stop so each frame replays the focus pull.
export default function Viewfinder({ stop, direction, onOpen }) {
  const hasSubject = stop.id !== 'rest' && subjects[stop.id];
  return (
    <div
      key={stop.id}
      className="viewfinder-panel"
      data-stop={stop.id}
      data-direction={direction}
    >
      {hasSubject ? <Subject stop={stop} onOpen={onOpen} /> : <Rest />}
    </div>
  );
}
