// One frame at a time. The shutter only ever exposes a single card, so this
// stays deliberately thin: a heading, a line, and at most one action.
export default function Viewfinder({ stop, frame, interactive }) {
  const isHome = stop.id === 'rest' && frame.id === 'name';

  return (
    <div className="viewfinder-panel" data-stop={stop.id} data-frame={frame.id}>
      {isHome ? (
        <h1 className="finder-title">
          <span>Nayeem</span>
          <span>Rahman</span>
        </h1>
      ) : (
        <h2 className="finder-title">{frame.title}</h2>
      )}

      <p className="finder-line">{frame.line}</p>

      {frame.action ? (
        <a
          className="finder-action"
          href={frame.action.href}
          target={frame.action.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          tabIndex={interactive ? 0 : -1}
          aria-hidden={interactive ? undefined : true}
        >
          {frame.action.label}
        </a>
      ) : null}
    </div>
  );
}
