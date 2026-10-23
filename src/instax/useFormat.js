import { useSyncExternalStore } from 'react';

// Keep in sync with the [data-format='wide'] rules in App.css and print.css.
const WIDE_QUERY = '(min-width: 900px) and (min-aspect-ratio: 1/1)';

function subscribe(onChange) {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function isWide() {
  return window.matchMedia(WIDE_QUERY).matches;
}

export function useFormat() {
  return useSyncExternalStore(subscribe, isWide) ? 'wide' : 'mini';
}
