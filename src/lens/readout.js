import { APERTURE, STOPS, stopIndex } from './stops';

function pad(value) {
  return String(value).padStart(2, '0');
}

export function frameNumber(stop) {
  return `${pad(stopIndex(stop) + 1)}/${pad(STOPS.length)}`;
}

export function exposure(stop) {
  return `${stop.mm}mm ƒ${APERTURE}`;
}
