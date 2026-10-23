import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { SLOT_FRACTION } from './body';

// Share of the scroll spent pulling the print out of the slot. The rest
// carries the camera away and lifts the print to fill the screen.
const PULL_SHARE = 0.55;
const PEEK_PX = 7;
const PRINT_TO_SLOT = 0.94;
const SCREEN_GAP = 16;
const OUT_AT = 0.995;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const lerp = (from, to, t) => from + (to - from) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function smoothstep(from, to, value) {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

export function useRelease({ enabled, reduceMotion, resetKey }) {
  const trackRef = useRef(null);
  const anchorRef = useRef(null);
  const cameraRef = useRef(null);
  const printRef = useRef(null);
  const scrollRef = useRef(null);
  const developRef = useRef(null);
  const frameRef = useRef(0);

  const travel = useCallback(() => {
    const track = trackRef.current;
    return track ? Math.max(1, track.offsetHeight - window.innerHeight) : 1;
  }, []);

  const update = useCallback(() => {
    frameRef.current = 0;
    const track = trackRef.current;
    const anchor = anchorRef.current;
    const camera = cameraRef.current;
    const print = printRef.current;
    if (!track || !anchor || !camera) return;

    const p = enabled ? clamp01(-track.getBoundingClientRect().top / travel()) : 0;
    if (!print) {
      camera.style.transform = '';
      camera.style.opacity = '';
      return;
    }

    const out = p >= OUT_AT;
    print.dataset.out = String(out);
    camera.dataset.away = String(out);

    if (reduceMotion) {
      const shown = smoothstep(0.2, 0.8, p);
      camera.style.transform = '';
      camera.style.opacity = String(1 - shown);
      print.style.transform = '';
      print.style.clipPath = shown > 0 ? 'none' : 'inset(0 0 100% 0)';
      print.style.opacity = String(shown);
      if (developRef.current) developRef.current.style.opacity = '0';
      return;
    }

    const vh = window.innerHeight;
    const cam = anchor.getBoundingClientRect();
    const slotX = cam.left + cam.width * SLOT_FRACTION.x;
    const slotY = cam.top + cam.height * SLOT_FRACTION.y;

    // The print is laid out at its full-screen size; every earlier pose is
    // a uniform scale of it, so its text never stretches.
    const finalLeft = print.offsetLeft;
    const finalTop = print.offsetTop;
    const finalW = print.offsetWidth;
    const smallW = cam.width * SLOT_FRACTION.w * PRINT_TO_SLOT;
    const startScale = smallW / finalW;
    const smallH = print.offsetHeight * startScale;

    const pulled = clamp01(p / PULL_SHARE);
    const lifted = easeInOut(clamp01((p - PULL_SHARE) / (1 - PULL_SHARE)));

    const liftMax = Math.max(0, slotY + smallH + SCREEN_GAP - vh);
    const lift = liftMax * pulled;
    const cameraY = -lift - lifted * (cam.bottom - lift + SCREEN_GAP);

    const pullY = slotY - lift - (smallH - PEEK_PX) * (1 - pulled);
    const x = lerp(slotX - smallW / 2, finalLeft, lifted);
    const y = lerp(pullY, finalTop, lifted);
    const scale = lerp(startScale, 1, lifted);
    const hidden = Math.max(0, (slotY + cameraY - y) / scale);

    camera.style.opacity = '';
    camera.style.transform = `translate3d(0, ${cameraY.toFixed(2)}px, 0)`;
    print.style.opacity = '';
    print.style.transform = `translate3d(${(x - finalLeft).toFixed(2)}px, ${(y - finalTop).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    print.style.clipPath = hidden > 0 ? `inset(${hidden.toFixed(2)}px 0 0 0)` : 'none';
    print.style.setProperty('--lifted', lifted.toFixed(3));
    if (developRef.current) {
      developRef.current.style.opacity = String(1 - smoothstep(0.08, 0.92, p));
    }
  }, [enabled, reduceMotion, travel]);

  const schedule = useCallback(() => {
    if (!frameRef.current) frameRef.current = requestAnimationFrame(update);
  }, [update]);

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    update();
  }, [update, resetKey]);

  useEffect(() => {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [schedule]);

  const scrollToShare = useCallback(
    (share) => {
      const top = (trackRef.current?.offsetTop ?? 0) + travel() * share;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [reduceMotion, travel],
  );

  const release = useCallback(() => scrollToShare(1), [scrollToShare]);
  const retract = useCallback(() => scrollToShare(0), [scrollToShare]);

  return { trackRef, anchorRef, cameraRef, printRef, scrollRef, developRef, release, retract };
}
