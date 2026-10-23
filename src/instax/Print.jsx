import { subjects } from '../lens/content';
import { exposure, frameNumber } from '../lens/readout';
import PrintContent from './PrintContent';
import './print.css';

export default function Print({ stop, printRef, scrollRef, developRef, onFocus, onClick, onBack }) {
  if (stop.id === 'rest') return null;

  return (
    <article
      className="print"
      ref={printRef}
      data-stop={stop.id}
      aria-labelledby="print-title"
      onFocus={onFocus}
      onClick={onClick}
    >
      <div className="print-photo">
        <div className="print-scroll" ref={scrollRef}>
          <PrintContent stop={stop} />
        </div>
        <p className="print-stamp" aria-hidden="true">
          {exposure(stop)} · {frameNumber(stop)}
        </p>
        <div className="print-develop" ref={developRef} aria-hidden="true" />
      </div>
      <footer className="print-strip">
        <h2 id="print-title" className="print-caption">
          {subjects[stop.id].title}
        </h2>
        <button
          type="button"
          className="print-back"
          onClick={(event) => {
            event.stopPropagation();
            onBack();
          }}
        >
          Back to camera
        </button>
      </footer>
    </article>
  );
}
