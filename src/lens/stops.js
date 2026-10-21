export const STOPS = [
  { id: 'rest', mm: '16', label: 'Home', hash: '', angle: -70 },
  { id: 'about', mm: '24', label: 'About', hash: '#about', angle: -35 },
  { id: 'work', mm: '50', label: 'Work', hash: '#work', angle: 0 },
  { id: 'photos', mm: '85', label: 'Photos', hash: '#photos', angle: 35 },
  { id: 'contact', mm: '135', label: 'Contact', hash: '#contact', angle: 70 },
];

export const APERTURE = '2.8';
export const FOCAL_RANGE = `${STOPS[0].mm}–${STOPS[STOPS.length - 1].mm}mm`;

export function rotationForStop(stop) {
  return -stop.angle;
}

export const MIN_ROTATION = rotationForStop(STOPS[STOPS.length - 1]);
export const MAX_ROTATION = rotationForStop(STOPS[0]);

export function stopFromHash(hash) {
  const normalized = hash || '';
  return STOPS.find((stop) => stop.hash === normalized) ?? STOPS[0];
}

export function nearestStop(rotation) {
  return STOPS.reduce((best, stop) => {
    const distance = Math.abs(rotation - rotationForStop(stop));
    const bestDistance = Math.abs(rotation - rotationForStop(best));
    return distance < bestDistance ? stop : best;
  }, STOPS[0]);
}

export function stopIndex(stop) {
  return STOPS.findIndex((item) => item.id === stop.id);
}
