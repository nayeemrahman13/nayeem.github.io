export const VIEWBOX = 100;
export const CX = 50;
export const CY = 50;

// Every radius the instrument uses, in viewBox units from the center.
// Layers must derive from this: painted rings, engraved ticks, type
// baselines, the index window, and the viewfinder hole.
export const R = {
  rim: 49.4,
  bandOuter: 47.8,
  tickOuter: 47.0,
  tickMinorInner: 45.2,
  tickMajorInner: 43.6,
  mm: 39.8,
  label: 36.4,
  bandInner: 35.4,
  gripOuter: 34.2,
  gripInner: 30.0,
  bronze: 29.2,
  coating: 28.0,
  hole: 27.1,
};

// Type sizes are tied to the band so the engraving scales with the metal.
export const TYPE = {
  mmSize: 3.2,
  labelSize: 2.1,
};

// Angular half-width of one stop's engraving. Stops sit 35 degrees apart,
// so 16 leaves a visible gap between neighbouring marks.
export const STOP_HALF_SPAN = 16;

// Zero degrees is 12 o'clock; positive is clockwise.
export function polar(angleDeg, r) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

export function arcPath(r, startAngle, endAngle) {
  const start = polar(startAngle, r);
  const end = polar(endAngle, r);
  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = endAngle > startAngle ? 1 : 0;
  return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${r} ${r} 0 ${large} ${sweep} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

export function annularSectorPath(rInner, rOuter, startAngle, endAngle) {
  const outerStart = polar(startAngle, rOuter);
  const outerEnd = polar(endAngle, rOuter);
  const innerEnd = polar(endAngle, rInner);
  const innerStart = polar(startAngle, rInner);
  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return [
    `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
    `L ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
    'Z',
  ].join(' ');
}

export function radialLine(angleDeg, rFrom, rTo) {
  const from = polar(angleDeg, rFrom);
  const to = polar(angleDeg, rTo);
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
}

// Percentage inset from the lens edge for a given radius, so CSS boxes
// (viewfinder, iris) land on the same circles as the SVG layers.
export function insetPercent(radius) {
  return `${(((VIEWBOX / 2 - radius) / VIEWBOX) * 100).toFixed(3)}%`;
}

// Radius as a percentage of the box's half-width, for radial-gradient stops.
function gradientStop(radius) {
  return `${((radius / (VIEWBOX / 2)) * 100).toFixed(2)}%`;
}

// The largest square that fits inside the viewfinder circle. Content lives
// in here so it can never be clipped by the round edge, however far it scrolls.
const SQUARE_SIZE = 1 / Math.SQRT2;

// Film placement, as fractions of the lens diameter so the strip scales with
// the barrel. FILM.gate sits just outside R.rim, which is what makes the film
// read as fed through the lens rather than parked beside it; FILM.tuck starts
// the stock well inside the rim so the barrel hides where it begins.
export const FILM = {
  height: 0.235,
  frameWidth: 0.26,
  frameGap: 0.014,
  // Just inside the rim, so the leading frame is clipped by the barrel and the
  // film reads as fed through the lens instead of parked beside it.
  gate: R.rim / VIEWBOX - 0.012,
  tuck: 0.26,
};

// A lens with a strip flying off one side reads as lopsided, so the instrument
// is shifted left by half of however far the exposed frames reach past the rim.
// That balances the pair as one composition while the bare stock still runs on
// past them, keeping the roll's sense of continuing.
const VISIBLE_FRAMES = 3;
export const FILM_RUN =
  FILM.gate +
  VISIBLE_FRAMES * FILM.frameWidth +
  (VISIBLE_FRAMES - 1) * FILM.frameGap -
  R.rim / VIEWBOX;

export const CSS_VARS = {
  '--hole-inset': insetPercent(R.hole),
  '--rim-mask-inner': gradientStop(R.bandOuter),
  '--rim-mask-outer': gradientStop(R.rim),
  '--panel-inset': `${(((1 - SQUARE_SIZE) / 2) * 100).toFixed(3)}%`,
  '--panel-size': `${(SQUARE_SIZE * 100).toFixed(3)}%`,
  '--film-h': FILM.height,
  '--film-frame-w': FILM.frameWidth,
  '--film-frame-gap': FILM.frameGap,
  '--film-gate': FILM.gate.toFixed(4),
  '--film-tuck': FILM.tuck,
  '--film-run': FILM_RUN.toFixed(4),
};
