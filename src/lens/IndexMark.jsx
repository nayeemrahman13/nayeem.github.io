import { R, STOP_HALF_SPAN, annularSectorPath, polar } from './geometry';

// The fixed reading window at 12 o'clock. It frames exactly the band the
// engraving lives in, so a stop lands inside it edge to edge.
export default function IndexMark() {
  const dot = polar(0, (R.rim + R.bandOuter) / 2);
  return (
    <svg className="index-mark" viewBox="0 0 100 100" aria-hidden="true">
      <path
        className="index-window"
        d={annularSectorPath(R.bandInner, R.bandOuter, -STOP_HALF_SPAN, STOP_HALF_SPAN)}
      />
      <circle className="index-dot" cx={dot.x} cy={dot.y} r="0.85" />
    </svg>
  );
}
