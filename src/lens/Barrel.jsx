import { Fragment } from 'react';
import { STOPS } from './stops';
import { R, STOP_HALF_SPAN, TYPE, annularSectorPath, arcPath, radialLine } from './geometry';

const MINOR_STEP = 5;
const STOP_ANGLES = new Set(STOPS.map((stop) => ((stop.angle % 360) + 360) % 360));

function BodyRings() {
  const knurl = [];
  for (let angle = 0; angle < 360; angle += 2) {
    const { x1, y1, x2, y2 } = radialLine(angle, R.gripInner, R.gripOuter);
    knurl.push(<line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }

  return (
    <g className="barrel-body">
      <circle cx="50" cy="50" r={R.rim} fill="url(#barrel-face)" />
      <circle cx="50" cy="50" r={R.rim} fill="none" stroke="#e0d8c4" strokeWidth="0.4" opacity="0.45" />
      <circle
        cx="50"
        cy="50"
        r={(R.bandOuter + R.bandInner) / 2}
        fill="none"
        stroke="#26272a"
        strokeWidth={R.bandOuter - R.bandInner}
      />
      <circle cx="50" cy="50" r={R.bandOuter} fill="none" stroke="#0f1011" strokeWidth="0.3" opacity="0.8" />
      <circle cx="50" cy="50" r={R.bandInner} fill="none" stroke="#0f1011" strokeWidth="0.3" opacity="0.8" />
      <g className="barrel-knurl">{knurl}</g>
      <circle cx="50" cy="50" r={R.bronze} fill="none" stroke="#c78e5a" strokeWidth="0.5" />
      <circle
        cx="50"
        cy="50"
        r={(R.coating + R.hole) / 2}
        fill="none"
        stroke="#29504b"
        strokeWidth={R.coating - R.hole}
      />
    </g>
  );
}

function Ticks() {
  const marks = [];
  for (let angle = 0; angle < 360; angle += MINOR_STEP) {
    const major = STOP_ANGLES.has(angle);
    const { x1, y1, x2, y2 } = radialLine(
      angle,
      R.tickOuter,
      major ? R.tickMajorInner : R.tickMinorInner,
    );
    marks.push(
      <line
        key={angle}
        className={major ? 'tick tick-major' : 'tick tick-minor'}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
      />,
    );
  }
  return <g className="barrel-ticks">{marks}</g>;
}

export default function Barrel({ liveStop, selectStop, didDragRef }) {
  return (
    <svg className="barrel-svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="barrel-face" cx="36%" cy="28%" r="82%">
          <stop offset="0" stopColor="#3c3d40" />
          <stop offset="0.6" stopColor="#2c2d2e" />
          <stop offset="1" stopColor="#1a1b1c" />
        </radialGradient>
        {STOPS.map((stop) => (
          <Fragment key={stop.id}>
            <path
              id={`arc-mm-${stop.id}`}
              d={arcPath(R.mm, stop.angle - STOP_HALF_SPAN, stop.angle + STOP_HALF_SPAN)}
            />
            <path
              id={`arc-label-${stop.id}`}
              d={arcPath(R.label, stop.angle - STOP_HALF_SPAN, stop.angle + STOP_HALF_SPAN)}
            />
          </Fragment>
        ))}
      </defs>

      <BodyRings />
      <Ticks />

      {STOPS.map((stop) => {
        const live = liveStop.id === stop.id;
        return (
          <a
            key={stop.id}
            id={`stop-${stop.id}`}
            className={live ? 'stop-mark is-live' : 'stop-mark'}
            href={stop.hash || '#top'}
            aria-current={live ? 'true' : undefined}
            aria-label={`${stop.mm} millimetres, ${stop.label}`}
            onClick={(event) => {
              event.preventDefault();
              if (didDragRef.current) return;
              selectStop(stop);
            }}
          >
            <path
              className="stop-hit"
              d={annularSectorPath(
                R.bandInner,
                R.bandOuter,
                stop.angle - STOP_HALF_SPAN,
                stop.angle + STOP_HALF_SPAN,
              )}
            />
            <text className="stop-mm" textAnchor="middle" fontSize={TYPE.mmSize}>
              <textPath href={`#arc-mm-${stop.id}`} startOffset="50%">
                {stop.mm}
              </textPath>
            </text>
            <text className="stop-label" textAnchor="middle" fontSize={TYPE.labelSize}>
              <textPath href={`#arc-label-${stop.id}`} startOffset="50%">
                {stop.label.toUpperCase()}
              </textPath>
            </text>
          </a>
        );
      })}
    </svg>
  );
}
